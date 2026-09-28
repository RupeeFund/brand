# Brand guidelines

This file is a summary. The full guidelines, with examples and the files to download, are at [brand.rupeefund.org](https://brand.rupeefund.org).

## Name

| Where      | Write                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Text       | The Rupee Fund. Always "The", with a capital "T" in a sentence too: "donate to The Rupee Fund". |
| Modifier   | Do not use the name as a modifier. Write "roles in The Rupee Fund", not "Rupee Fund roles".     |
| Logo       | The logo artwork only. Do not type the logo as text.                                            |
| Short name | `RupeeFund`. Where a web manifest `short_name` or an app label needs it, you can use `TRF`.     |
| Code       | `RupeeFund`                                                                                     |

## Logo

- The logo has three parts: the green block, the rupee sign and the word "fund". Keep them together, in these colours and in this order.
- Keep one block width of clear space on each side.
- Show the logo at 24 px high or larger. Below that, use the icon.
- On light backgrounds, use `lockup-light.svg`. On dark backgrounds, use `lockup-dark.svg`.
- Do not stretch, recolour, rotate or add effects to the logo. Do not put it on green.

## Icon

- Use `mark.svg` at 48 px and larger.
- Use `mark-small.svg` from 16 to 32 px.

## Colour

`tokens/tokens.json` holds the colours. Text needs a contrast of 4.5:1 or more. Shapes and icons need 3:1 or more (WCAG 2.2).

Brand green (`#08b74f`) on white is 2.66:1. Do not use it for text or controls. Use deep green (`#057a33`) for text in green. The logo is an exception.

| Use          | Rule                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| Text on dark | On `ink`, use `paper` for text and `white` for links.                                                    |
| Errors       | Use `error` (`#c62828`) for error text and error icons. It passes 4.5:1 on `white`, `card` and `paper`.  |
| Controls     | Give an input or a control a boundary of 3:1 or more. Use `border` (`#858585`). Dividers can be lighter. |
| Focus        | Show a solid 2 px ring. Use `brand-fg` on light surfaces and `white` on `ink`.                           |

## Type

Use [Inter](https://rsms.me/inter/) 4.

| Style    | Rule                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------- |
| Headings | SemiBold (600). Letter spacing −0.033 em.                                                       |
| Text     | Regular (400). Line height 1.6.                                                                 |
| Medium   | Medium (500) for navigation, links in lists and short interface text. Not for text or headings. |
| Labels   | SemiBold (600), 0.8125 rem, uppercase. Letter spacing +0.12 em.                                 |
| Features | Turn on `cv11` (single-storey a) and `ss01` (open digits) for all text.                         |
| Figures  | Use `tabular-nums` for numbers that change, such as amounts, counts and dates.                  |

## Voice

- Trustworthy: say what happens to the money. Give numbers and dates.
- Communal: write "we" and "you".
- Plain: use short words and short sentences.
- Indian: use rupees, Indian places and Indian projects.
- Open: show how decisions are made. Link to the source.
- Participatory: ask people to give, to nominate and to vote. Tell them what changed.

## Credit and licence

Credit the logo as "© 2026 FOSS United Community, CC BY-ND 4.0". Share the files unchanged.
