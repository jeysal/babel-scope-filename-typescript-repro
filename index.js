const { transform } = require("@babel/core");

const plugin = ({ types: t }) => ({
  visitor: {
    CallExpression(path) {
      if (path.node.callee.name === "a") {
        path.scope
          .getProgramParent()
          .path.unshiftContainer(
            "body",
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier("local"))],
              t.stringLiteral("source")
            )
          );

        path.scope.crawl();
        path.node.callee = t.identifier("local");
      }
    }
  }
});

console.log(
  transform(`a();`, {
    presets: ["@babel/preset-typescript"],
    plugins: [plugin]
  }).code
);

/*
  Generated code misses the import.
  Ways to fix this (ONE of the following is sufficient):
  * disable `@babel/preset-typescript`
  * `crawl` one line later
*/
