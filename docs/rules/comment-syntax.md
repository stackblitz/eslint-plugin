# `@blitz/comment-syntax`

> Enforce block and line comment style

- Block comments should be capitalized

  ```ts
  /**
   * Block comments should start with a capitalized word.
   */
  ```

- Block comments should end on punctuation

  ```ts
  /**
   * This comment should end on punctuation.
   */
  ```

- Paragraphs should be capitalized

  ```ts
  /**
   * Every paragraph should be capitalized.
   *
   * I am another paragraph.
   */
  ```

- Block comments **should not** end on a newline

  👎

  ```ts
  /**
   * I am a block comment and there should not be a newline at the end.
   *
   */
  ```

  👍

  ```ts
  /**
   * I am a block comment and there should not be a newline at the end.
   */
  ```

- Block comments should be properly formatted, e.g. it expects a space after `*`, or requires all `*` to be aligned

  👎

  ```ts
  /**
   *There is a space missing at the beginning.
      * This line is not correctly aligned.
   */
  ```

  👍

  ```ts
  /**
   * I am a block comment.
   * This line is properly aligned.
   */
  ```

- Requires a space at the beginning of a list item

  👎

  ```ts
  /**
   * Here is a malformed list:
   * -a
   */
  ```

  👍

  ```ts
  /**
   * Here is a well-formatted list:
   * - a
   */
  ```

- Requires a newline before JSDocs

  👎

  ```ts
  /**
   * This is some comment.
   * @see http://some-link.com
   */
  ```

  👍

  ```ts
  /**
   * This is some comment.
   *
   * @see http://some-link.com
   */
  ```

- Line comments should be lowercased (expect for ignored words)

  👎

  ```ts
  // Some comment
  ```

  👍

  ```ts
  // some comment
  ```

- Line comments should **not** end on punctuation

  👎

  ```ts
  // some comment.
  ```

  👍

  ```ts
  // some comment
  ```

## Options

The rule allows for the following options:

```ts
interface Options {
  ignoredWords?: string[];
  allowedParagraphEndings?: string[];
}
```

### `ignoredWords`

A list of words that are excluded from capitalization checks for line comments and paragraphs in block comments.

### `allowedParagraphEndings`

A list of characters allowed to be used to end a paragraph in block comments.
