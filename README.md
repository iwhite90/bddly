<h1>Bddly</h1>

Bddly is a lightweight [Behaviour Driven Development](https://en.wikipedia.org/wiki/Behavior-driven_development) testing wrapper for [Jest](https://jestjs.io/). Unlike other BDD frameworks, such as [Cucumber](https://cucumber.io/), it doesn't require the use of non-code textual spec files. All your tests and specs are written in code, which makes for a more fluid workflow, and lets the compiler help you just like when writing the rest of your code.

Bddly generates nice html files with the output of your tests, which can be the living documentation of the behaviour of your system.

![Example output](https://github.com/iwhite90/bddly/example_output.png)

Bddly was inspired by [YatSpec](https://github.com/bodar/yatspec), which is a BDD testing framework for Java.

Bddly is written in TypeScript, and is designed to work with TypeScript projects. Vanilla JavaScript projects may need some fiddling to get this to work!

### Quick Start ###

##### Setup #####

```bash
npm i bddly --save-dev
```

In your tsconfig.json file, add ```"resolveJsonModule": true``` so that Bddly can read your project name from package.json.

There is an example Nest.js project using Bddly that you might find instructive [here](https://github.com/iwhite90/nest-bddly-example). It has a slightly cleaner structure than the following example.

##### Test file #####

Bddly will look for test files under the bddly-tests folder. Your file name should end with ```-spec.ts``` in order for it to be recognised.

Start by creating a standard Jest test file, then add the following import:

```
import { Step, spec, specFinished, suiteStart, suiteFinished } from '../bddly';
```

Your import path might be different, depending on where your test file is.

Bddly uses decorators to wrap your BDD test steps, so that it can capture information to generate reports. For this to work, we need a bit of boilerplate. Firstly, we need to create classes to hold the implementations of your BDD steps, so go ahead and create the following:

```
class Given {}

class When {}

class Then {}

class And {}
```

We're going to initialise these classes within the Jest beforeAll function, so at the top level let's declare them first:

```
let given: Given;
let when: When;
let then: Then;
let and: And;
```

Then in the beforeAll function:

```
given = new Given();
when = new When();
then = new Then();
and = new And();

suiteStart();
```

And for the final piece of boilerplate, add calls to the Jest afterEach and afterAll methods:

```
    afterEach(() => {
        specFinished(expect.getState().currentTestName);
    });

    afterAll(() => {
        suiteFinished(expect.getState().currentTestName, __filename);
    });
```

##### A first test #####

Now that's all set up, let's write our first test. We use the Bddly spec function to define our test, which takes a test name, and an anonymous function with the test steps.

Here's the whole call to Jest describe:

```
describe('Bddly test:', () => {
    let given: Given;
    let when: When;
    let then: Then;
    let and: And;

    beforeAll(async () => {
        given = new Given();
        when = new When();
        then = new Then();
        and = new And();

        suiteStart();
    });

    afterEach(() => {
        specFinished(expect.getState().currentTestName);
    });

    afterAll(async () => {
        suiteFinished(expect.getState().currentTestName, __filename);
    });

    describe('Example tests:', () => {
        spec('Doubles a number', () => {
            given.aNumber(2);
            when.theNumberDoublerIsCalled();
            then.theStoreShouldBe(4);
        });
    });
});
```

Of note, each describe description ends in a colon. Bddly uses this to know which of the describes are part of the path to the test, and which is the test name.

The last thing to do is to write the implementations of the BDD steps, within the Given, When and Then classes. We'll also create a variable to hold the number:

```
let store: number;

class Given {
    @Step
    aNumber(x: number) {
        store = x;
    }
}

class When {
    @Step
    theNumberDoublerIsCalled() {
        store = store * 2;
    }
}

class Then {
    @Step
    theStoreShouldBe(x: number) {
        expect(store).toBe(x);
    }
}
```

Just remember to annotate each of these methods with the @Step decorator, so that Bddly knows to pay attention to them!

And that's it. Now just...

##### Run the test #####

Add a script to your package.json:

```
"test:e2e": "jest -i --config ./test/jest-e2e.json"
```

In this example, test-e2e.json is the jest config file. Your's might be different.

Then in the terminal run ```npm run test:e2e```.

You should see the result of your test in the terminal (hopefully it passes!), and there should be a new top level folder in your project called bdd-reports. Open index.html in your browser to see a contents list of your Bddly tests.

### Next steps ###

Real world apps have dependencies you need to include in your test. For instance, a database. You can add constructors to the Given, When, Then and And classes to inject dependencies you might want to use.

Here's an example of a Given class that needs to use a PrismaService to set up data in a database:

```
class Given {
    constructor(private prisma: PrismaService) {}

    @Step
    aProductIsInTheDatabaseWithName(name: string) {
        return this.prisma.product.create({
            data: { name: name },
        });
    }
}
```

and here's a When class that triggers a call to a test version of a Nest.js app:

```
class When {
    constructor(private app: INestApplication) {}

    @Step
    aRequestIsMadeTo(endpoint: string) {
        return request(this.app.getHttpServer())
            .get(endpoint)
            .then((resp) => {
                responseStatus = resp.status;
                responseBody = resp.body;
            });
    }
}
```

Note that we're assigning the response status and body to global variables. This is to capture the values so that we can assert on them in the Then class, like:

```
class Then {
    @Step
    theResponseStatusShouldBe(status: number) {
        expect(responseStatus).toBe(status);
    }
}
```

This is what the setup might look like for this:

```
let given: Given;
let when: When;
let then: Then;
let and: And;

let responseStatus: number;
let responseBody: any;

describe('Nest app:', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get<PrismaService>(PrismaService);

        const { httpAdapter } = app.get(HttpAdapterHost);
        app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

        given = new Given(prisma);
        when = new When(app);
        then = new Then();
        and = new And();

        suiteStart();

        await app.init();
    });

    beforeEach(async () => {
        await prisma.product.deleteMany();
    });

    afterEach(() => {
        specFinished(expect.getState().currentTestName);
    });

    afterAll(async () => {
        suiteFinished(expect.getState().currentTestName, __filename);
        await prisma.$disconnect();
        await app.close();
    });
```

### Interesting Givens and Reports ###

Often it's useful to display additional data in the test reports. For instance, if you're priming your database with some data as part of a Given step, you might want to call out something about the data, such as an entity name, or number of rows inserted. In this case, use Bddly's interestingGiven function, which takes a name for the interesting fact, and the fact itself.

You can do the same for responses, using the report function.

Interesting givens and reports will be displayed in the Bddly test output, and if the value of any interesting givens are in any of the reports, then they will be highlighted.

Here's an example using our number doubler test from before:

```
let store: number;

class Given {
    @Step
    aNumber(x: number) {
        interestingGiven('The stored number', x);
        store = x;
    }
}

class When {
    @Step
    theNumberDoublerIsCalled() {
        store = store * 2;
    }
}

class Then {
    @Step
    theStoreShouldBe(x: number) {
        report('The number after doubling', store);
        expect(store).toBe(x);
    }
}
```