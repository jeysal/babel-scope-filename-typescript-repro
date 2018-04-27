const { transform } = require("@babel/core");

const plugin = ({ types: t }) => ({
  visitor: {
    Program(path) {
      const [importPath] = path.unshiftContainer(
        "body",
        t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier("local"))],
          t.stringLiteral("source")
        )
      );
      path.scope.registerDeclaration(importPath);
      //path.scope.crawl() // same result
    }
  }
});

console.log(
  transform(`a();`, {
    presets: ["@babel/preset-env"],
    plugins: [plugin],
    filename: "test.js"
  }).code
);

/*
  Generated code misses the import.
  Ways to fix this (ONE of the following is sufficient):
  * remove the `filename` in the transform call
  * change `a()` to `local()` - NEVERMIND THIS DOES NOT FIX IT
  * disable `@babel/preset-typescript` in .babelrc
  * do not `registerDeclaration` / `crawl`
*/
