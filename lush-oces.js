const products={
  "dawn": {
    "title": "Dawn Chorus.",
    "type": "BATH BOMB",
    "alt": "Green bath bomb with an uninterrupted granular surface",
    "colour": "dawn-image",
    "line": "Citrus. Lemongrass. A green beginning.",
    "description": "A bright green bathing ritual inspired by the first sound of a living forest. This LUSH × OCES concept edition supports Project EROS Phase II.",
    "notes": "Citrus, lemongrass and bergamot — inspired by the existing Avobath fragrance profile.",
    "research": "Scent and material interaction: investigate whether chemical signals carry information for each species and how they behave with candidate wearable materials.",
    "reference": "Avobath",
    "source": "https://www.lush.com/uk/en/p/avobath-bath-bomb"
  },
  "forest": {
    "title": "Forest Memory.",
    "type": "BATH BOMB",
    "alt": "Pastel bath bomb with an uninterrupted granular surface",
    "colour": "forest-image",
    "line": "Pine. Osmanthus. A landscape remembered.",
    "description": "A forest-inspired bathing ritual that keeps species research and habitat responsibility in the same conversation.",
    "notes": "Herbaceous pine and honeyed osmanthus — inspired by the existing Lakes fragrance profile.",
    "research": "Species-specific courtship signals: observe recognition and display alongside material behaviour and welfare. Beech-forest food availability stays within the conservation brief.",
    "reference": "Lakes",
    "source": "https://www.lush.com/uk/en/p/lakes-bath-bomb"
  },
  "signal": {
    "title": "Signal Study.",
    "type": "BODY SPRAY",
    "alt": "Signal Study black trigger spray with a green outlined Lush label and unmarked plastic",
    "colour": "signal-image",
    "line": "Citrus peel. Green leaf. A first impression.",
    "description": "A fragrance for human skin. A question for avian research. Signal Study imagines a fresh, green scent within the 2095 LUSH × OCES collection.",
    "notes": "Imagined notes: citrus peel, crushed green leaf and soft cedar. 200 ml concept edition.",
    "research": "Investigate how scent interacts with visual and behavioural signals. Compare responses by species, rather than assuming that a fragrance attractive to humans attracts birds.",
    "referenceText": "Concept packaging based on the supplied Lush trigger-spray reference. AI-assisted visual mockup; formulation is a design proposal."
  },
  "trace": {
    "title": "Forest Trace.",
    "type": "BODY SPRAY",
    "alt": "Forest Trace black trigger spray with a pale yellow Lush label border and unmarked plastic",
    "colour": "trace-image",
    "line": "Woodland air. Moss. A lingering trace.",
    "description": "A human fragrance imagined around the memory of a forest. Forest Trace supports the questions that connect scent, materials and species-specific courtship.",
    "notes": "Imagined notes: fresh woodland air, moss and dry wood. 200 ml concept edition.",
    "research": "Study scent retention and release across candidate textiles, together with residue, movement and feather contact. Findings inform separate species-specific courtship and welfare assessments.",
    "referenceText": "Concept packaging based on the supplied Lush trigger-spray reference. AI-assisted visual mockup; formulation is a design proposal."
  },
  "soft": {
    "title": "Soft Signal.",
    "type": "FACIAL CLEANSER",
    "alt": "Soft Signal black cleanser pot with an ivory cream dollop and an unmarked lid",
    "colour": "soft-image",
    "line": "A creamy texture. A gentler ritual.",
    "description": "An imagined creamy facial cleanser for people. Its tactile character brings material interaction into an everyday ritual.",
    "notes": "Concept texture: a smooth ivory cream. Imagined notes: oat milk and a quiet floral accord. 100 g concept edition.",
    "research": "Compare material contact, texture and residue within the EROS research brief. The collection funds the study; the human cleanser is separate from avian-use prototypes.",
    "referenceText": "Original AI-assisted concept still life, using the supplied Lush cleanser textures as visual references. Formulation is a design proposal."
  },
  "leaf": {
    "title": "Leaf & Light.",
    "type": "FACIAL CLEANSER",
    "alt": "Leaf and Light black cleanser pot with botanical paste and an unmarked lid",
    "colour": "leaf-image",
    "line": "Botanical grains. Woodland thinking.",
    "description": "An imagined botanical facial cleanser for people, pairing a crumbly paste with the partnership’s questions about responsible materials and species-specific signals.",
    "notes": "Concept texture: a beige botanical paste with green herbal flecks. Imagined notes: lavender leaf and chamomile. 100 g concept edition.",
    "research": "Support observation of species-specific courtship signals alongside responsible sourcing and material behaviour. Habitat food resources remain part of the conservation brief.",
    "referenceText": "Original AI-assisted concept still life, using the supplied Lush cleanser textures as visual references. Formulation is a design proposal."
  }
};
const prices={"dawn":8,"forest":9,"signal":28,"trace":30,"soft":16,"leaf":18};
Object.entries(prices).forEach(([id,price])=>products[id].price=price);
const productDialog=document.querySelector('.product-dialog');
const creditsDialog=document.querySelector('.credits-dialog');
let lastTrigger=null;
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{
 const product=products[button.dataset.product];if(!product)return;lastTrigger=button;
 const image=document.getElementById('dialog-product-image');const cardImage=button.closest('.product-card').querySelector('.product-image img');image.src=cardImage.currentSrc||cardImage.src;image.alt=product.alt;
 document.getElementById('product-title').textContent=product.title;
 document.getElementById('dialog-product-price').textContent='£'+product.price.toFixed(2);document.getElementById('dialog-add').dataset.add=button.dataset.product;
 document.getElementById('product-description').textContent=product.description;
 document.getElementById('product-notes').textContent=product.notes;
 document.getElementById('product-research').textContent=product.research;
 const reference=document.getElementById('product-reference');reference.replaceChildren();
 if(product.source){reference.appendChild(document.createTextNode('AI-assisted concept image. Original photographic reference: '));const link=document.createElement('a');link.href=product.source;link.textContent=product.reference+' by Lush ↗';link.target='_blank';link.rel='noopener noreferrer';reference.appendChild(link);}else{reference.textContent=product.referenceText;}
 document.getElementById('dialog-product-kicker').textContent=product.type+' / EROS EDITION / 2095';
 productDialog.showModal();
}));
document.getElementById('photo-credits').addEventListener('click',event=>{lastTrigger=event.currentTarget;creditsDialog.showModal();});
document.querySelectorAll('.product-dialog,.credits-dialog').forEach(dialog=>{
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>lastTrigger?.focus());
 dialog.addEventListener('click',event=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();});
});
