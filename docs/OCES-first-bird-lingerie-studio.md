# First Bird Lingerie / studio photography

Updated 8 October 2026.

The project author supplied nine original studio photographs of the first Bird Lingerie design. The new gallery is the first group within the main website’s Sketch / design archive, before “Sound, movement & fit.” Its heading is “The first Bird Lingerie.”

Each photograph was edited separately with the built-in imagegen tool to remove the studio background. The displayed files are PNGs with genuine transparent alpha. The request was to retain the photographed product, handmade construction details, original view and visible support sticks. They are edited versions of the author’s product photographs. The unedited JPEGs are preserved separately.

| View | Display PNG | Original JPEG |
| --- | --- | --- |
| 01 / Front / colour panels | assets/bird-lingerie-first-01.png | assets/studio-originals/bird-lingerie-first-01.jpg |
| 02 / From above | assets/bird-lingerie-first-02.png | assets/studio-originals/bird-lingerie-first-02.jpg |
| 03 / Shape / laid flat | assets/bird-lingerie-first-03.png | assets/studio-originals/bird-lingerie-first-03.jpg |
| 04 / Side / open structure | assets/bird-lingerie-first-04.png | assets/studio-originals/bird-lingerie-first-04.jpg |
| 05 / Cut-outs / close view | assets/bird-lingerie-first-05.png | assets/studio-originals/bird-lingerie-first-05.jpg |
| 06 / Side / panel profile | assets/bird-lingerie-first-06.png | assets/studio-originals/bird-lingerie-first-06.jpg |
| 07 / Reverse / contour | assets/bird-lingerie-first-07.png | assets/studio-originals/bird-lingerie-first-07.jpg |
| 08 / Front / tapered form | assets/bird-lingerie-first-08.png | assets/studio-originals/bird-lingerie-first-08.jpg |
| 09 / Construction / at rest | assets/bird-lingerie-first-09.png | assets/studio-originals/bird-lingerie-first-09.jpg |

The gallery uses a pale display surface so the transparent objects read clearly. Images are contained without cropping. Each photograph opens in the archive viewer, with Previous / Next, arrow keys and Escape. The nine views are the first nine items in the viewer’s order. Other website sections retain their existing content.

## Background-removal prompt

Used for each input separately, with transparent_background=true:

> Use case: background-extraction. Edit this original studio product photograph by removing ONLY the entire gray studio background to genuine transparency (alpha). Retain the exact photographed green, yellow and orange handcrafted Bird Lingerie object and its brown support stick if one is visible in this photograph. Preserve the object's exact geometry, angle, proportions, cut edges, handmade irregularities, paper/fabric surface texture, colors, folds, straps, holes and existing self-shadow. Do not redesign, beautify, reconstruct or replace the product with an illustration. All gray backdrop visible through gaps and openings must also become transparent; distinguish empty holes from the dark green interior material. Retain the visible stick if present, and do not add a stick to an unmounted view, but no studio floor, backdrop or cast background shadow. Place the unchanged cutout centered on a tightly framed transparent canvas with a modest 8% margin; trim excessive original blank space above the product, do not crop the product itself. Keep this view separate as one image; no collage, no additional objects, no text, no opaque white background, no checkerboard painted into the image. Output one PNG with actual transparent alpha.

View 01 used the same prompt with “and its brown support stick” and “Retain the visible stick,” in place of the conditional stick wording. Views 02–09 used the prompt above.

## Validation

Checked 8 October 2026: all nine PNGs have transparent alpha and the nine archived JPEGs match the supplied originals byte for byte. The homepage was checked at 1440px and 390px widths: all images load, every product opens in the archive viewer, arrow-key navigation and Escape work, and the nine product views precede the original archive. All 128 local resource references resolve. The standalone OCES-submission.html also opens with its images embedded. Browser checks reported no errors.
