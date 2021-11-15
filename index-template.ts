import { robot as robot } from './icon';

export const toHTML = () => `
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

            <title>BDD Test Results</title>
        </head>
        <body>
            <nav class="navbar sticky-top navbar-expand-md navbar-dark bg-dark mb-4">
                <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    ${robot()}
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    Bddly report
                </div>
                </div>
            </nav>
            <main>
                <div class="container py-4">
                    <header class="pb-3 mb-4 border-bottom">
                        <span class="fs-4">Contents</span>
                    </header>

                    <div class="p-5 mb-4 bg-light rounded-3">
                        <div class="container-fluid py-1">
                            <div>
                                <ul>
                                    <li>products</li>
                                    <li>
                                    <ul>
                                        <li>create-products</li>
                                            <li>
                                                <ul>
                                                    <a href="./products/create-products/products.e2e-spec.html">products.e2e.spec</a>
                                                </ul>
                                            </li>
                                            <li>update-products</li>
                                            <li>
                                                <ul>
                                                    <a href="./products/update-products/update-products-happy-path-spec.html">update-products-happy-path-spec</a>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <footer class="pt-3 mt-4 text-muted border-top">&copy; 2021</footer>
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
