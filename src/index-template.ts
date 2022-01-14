import { robot as robot } from './icon';
import { Node } from './model';

export const toHTML = (title: string, root: Node) => `
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
                    <a class="navbar-brand" href="#">
                        ${robot()}
                    </a>
                    <div class="collapse navbar-collapse" id="navbarCollapse">
                        <div class="text-white fs-4">${title}</div>
                    </div>
                </div>
            </nav>
            <main>
                <div class="container py-4">
                    <header class="pb-3 mb-4 border-bottom">
                        <span class="fs-3">Test results</span>
                    </header>

                    <div class="p-5 mb-4 bg-light rounded-3">
                        <div class="container-fluid py-1 fs-4">
                            <div>
                                <ul>
                                    ${root.children.map((node) => contents(node, '.')).join('')}
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

const contents = (node: Node, path: string): string => {
  if (node.children.length) {
    return `
            <li>${prettify(node.name)}</li>
            <li>
                <ul>
                    ${node.children.map((child) => contents(child, [path, node.name].join('/'))).join('')}
                </ul>
            </li>
        `;
  } else {
    return `
            <li><a href="${[path, node.name].join('/') + '.html'}">${prettify(node.name)}</a></li>
        `;
  }
};

const prettify = (name: string) => {
  const spacedString = name.split('-').join(' ');
  return spacedString.charAt(0).toUpperCase() + spacedString.substring(1);
};
