// Turn a movie Title (the DB key) into a URL-safe slug.
// e.g. "Amelie" -> "amelie", "20th Century Women" -> "20th-century-women".
export function movieSlug(title: string): string {
  return [...title.normalize('NFD')]
    .filter((ch) => {
      const c = ch.codePointAt(0) ?? 0;
      return c < 0x300 || c > 0x36f; // drop combining diacritical marks
    })
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
