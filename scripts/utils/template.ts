export type TemplateValues = Readonly<Record<string, string | undefined>>;

const PLACEHOLDER_REGEX = /\{\{(\w+)\}\}/g;

export const yamlString = (value: string): string => JSON.stringify(value);
export const yamlList = (items: readonly string[]): string =>
  `[${items.map(yamlString).join(', ')}]`;

/**
 * Replaces `{{key}}` placeholders. A line whose placeholders include an `undefined` value is
 * dropped, which is how optional fields disappear without conditional blocks.
 */
export function renderTemplate(template: string, values: TemplateValues): string {
  for (const [placeholder, key = ''] of template.matchAll(PLACEHOLDER_REGEX)) {
    if (!Object.hasOwn(values, key))
      throw new Error(`Template has an unknown placeholder: ${placeholder}`);
  }

  const rendered = template
    .split('\n')
    .filter((line) =>
      Array.from(line.matchAll(PLACEHOLDER_REGEX)).every(
        ([, key = '']) => values[key] !== undefined,
      ),
    )
    .join('\n')
    .replace(PLACEHOLDER_REGEX, (_, key: string) => values[key] ?? '')
    .trimEnd();

  return `${rendered}\n`;
}
