import { robot as robot } from './icon';
import * as model from './model';

export const toHTML = (title: string, suite: string, reports: model.SpecInfo[], breadcrumb: string[]) => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                crossorigin="anonymous"
            />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css">

            <title>${title}</title>
        </head>
        <body>
            <nav class="navbar sticky-top navbar-expand-md navbar-dark bg-dark mb-4">
                <div class="container-fluid">
                <a class="navbar-brand" href="${linkToIndex(breadcrumb)}">
                    ${robot()}
                </a>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <div class="text-white fs-4">${title}</div>
                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="fs-5">Tests</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                            ${reports.map(contentsTemplate).join('')}
                            </ul>
                        </li>
                    </ul>
                    <ol class="breadcrumb">
                        ${breadcrumb.map(breadcrumbTemplate).join('')}
                    </ol>
                </div>
                </div>
            </nav>
            <main>
                <div class="container py-4">
                    <header class="pb-3 mb-4 border-bottom">
                        <span class="fs-4">${suite}</span>
                    </header>

                    ${reports.map(testTemplate).join('')}

                    <footer class="pt-3 mt-4 text-muted border-top">&copy; ${new Date().getFullYear()}</footer>
                </div>
            </main>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
                crossorigin="anonymous"
            ></script>
        </body>
    </html>
`;

const testTemplate = (report: model.SpecInfo, index: number) => {
  return `
    <div id="test${index}" class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-1">
            <div class="row">
                <div class="col-md-10">
                    <h1 class="display-6 fw-bold">${report.testName}</h1>
                </div>
                <div class="col-md-2">
                    ${testStatusTemplate(report.testFailed)}
                </div>
            </div>
        </div>
        <div class="container-fluid py-1">
            <div class="container-fluid py-4 lh-1">
                ${report.steps.map(stepTemplate).join('')}
            </div>
        </div>
        <div class="row align-items-md-stretch">
            <div class="col-md-6">
                <div class="h-100 p-4 text-white bg-dark rounded-3">
                    <h2 class="mb-3">Interesting Givens</h2>
                    ${report.interestingGivens.map(interestingGivensTemplate).join('')}
                </div>
            </div>
            <div class="col-md-6">
                <div class="h-100 p-4 bg-light border rounded-3">
                    ${report.reportLog
                      .map((log) =>
                        reportLogTemplate(
                          log,
                          report.interestingGivens.map((ig) => ig.data),
                        ),
                      )
                      .join('')}
                </div>
            </div>
        </div>
    </div>
    `;
};

const linkToIndex = (breadcrumb: string[]) => {
  const [_, ...rest] = breadcrumb;
  const path = rest.map(() => '..');
  path.push('index.html');
  return path.join('/');
};

const breadcrumbTemplate = (step: string) => {
  return `<li class="breadcrumb-item active text-white" aria-current="page">${step}</li>`;
};

const contentsTemplate = (report: model.SpecInfo, index: number) => {
  return `<li><a class="dropdown-item" href="#test${index}">${report.testName}</a></li>`;
};

const stepTemplate = (step: model.Step) => {
  return `<p class="col-md-8 fs-5"><strong>${step.stepType}</strong> ${step.description} <em>${step.param}</em></p>`;
};

const interestingGivensTemplate = (interestingGiven: model.InterestingGiven) => {
  return `
        <h4>${interestingGiven.title}</h4>
        <pre><code>${interestingGiven.data}</code></pre>
    `;
};

const testStatusTemplate = (testFailed: boolean) => {
  const status = testFailed ? 'Test failed' : 'Test passed';
  const bg = testFailed ? 'bg-danger' : 'bg-success';
  return `<div class="p-2 ${bg} text-white text-center fs-5 rounded-3">${status}</div>`;
};

const reportLogTemplate = (reportLog: model.Report, markValues: string[]) => {
  return `
        <h2 class="mb-3">${reportLog.title}</h2>
        <pre><code>${markText(reportLog.data, markValues)}</code></pre>
    `;
};

const markText = (text: string, markValues: string[]) => {
  markValues.forEach((markValue) => {
    text = text.split(markValue).join(`<mark>${markValue}</mark>`);
  });
  return text;
};
