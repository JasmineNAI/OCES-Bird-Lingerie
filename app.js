(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('js-motion');
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); }
    }), { threshold: .07 });
    $$('.reveal').forEach(el => reveals.observe(el));
  }

  const progress = $('.scroll-progress');
  let scrollQueued = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    $('.site-header').classList.toggle('is-solid', $('#top').getBoundingClientRect().bottom <= $('.site-header').offsetHeight + 64);
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  const menu = $('#mobile-nav');
  const menuToggle = $('.menu-toggle');
  const closeMenu = () => { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); };
  menuToggle.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  });
  $$('a', menu).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); });

  const milestones = $$('.timeline-milestone');
  milestones.forEach((milestone, index) => {
    milestone.addEventListener('toggle', () => {
      if (milestone.open) milestones.forEach(other => {
        if (other !== milestone) other.open = false;
      });
      updateScroll();
    });
    $('summary', milestone).addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown') next = Math.min(index + 1, milestones.length - 1);
      if (event.key === 'ArrowUp') next = Math.max(index - 1, 0);
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = milestones.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        $('summary', milestones[next]).focus();
      }
    });
  });

  const climateData = {
  "habitat": [
    "Less habitat.<br>Fewer possibilities.",
    "Deforestation and fragmented forests separate feeding grounds, nesting sites and potential mates. OCES connects habitat restoration with species monitoring, so recovery has somewhere to happen."
  ],
  "food": [
    "Food changes.<br>Life follows.",
    "The commercial “Insect-Free World” removes a vital food source through pesticides and automated insect-killing systems. Disrupted pollination and food chains leave birds with less food and poorer nutrition."
  ],
  "colour": [
    "A quieter colour.<br>A weaker signal.",
    "Poor nutrition and increased UV-B exposure, linked to long-term pollution and a reversal in ozone-layer recovery, weaken colour, iridescence and ultraviolet reflection. Project EROS studies these courtship signals from the bird’s perspective."
  ],
  "connection": [
    "A missed signal.<br>A missing generation.",
    "Many birds remain biologically able to reproduce while struggling to attract or recognise a mate. Project EROS brings behavioural research and species-specific design to this courtship crisis."
  ]
};
  function wireTabs(buttons, onSelect) {
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        buttons.forEach(b => { b.setAttribute('aria-selected', String(b === button)); b.tabIndex = b === button ? 0 : -1; });
        onSelect(button);
      });
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = buttons.length - 1;
        if (next !== undefined) { event.preventDefault(); buttons[next].focus(); buttons[next].click(); }
      });
    });
  }
  wireTabs($$('[data-climate]'), button => {
    const [heading, copy] = climateData[button.dataset.climate];
    const panel = $('#climate-panel');
    panel.setAttribute('aria-labelledby', button.id);
    panel.innerHTML = `<h3>${heading}</h3><p>${copy}</p>`;
  });
  const erosData = {
  "colour": "We map each species’ visual signals before selecting colour. Pigment, contrast and reflectance are evaluated from the bird’s perspective, with the original courtship display as the reference.",
  "motion": "A design must move with the animal. We study courtship displays, wing clearance, balance and preening to identify forms that preserve natural movement and avoid restricting flight.",
  "welfare": "Weight, fit and contact with feathers are assessed alongside behaviour. Review includes removal, stress indicators and the option to stop an intervention whenever its benefit is uncertain."
};
  let birdActionTimer;
  wireTabs($$('[data-eros]'), button => {
    const copy = erosData[button.dataset.eros];
    const panel = $('#eros-detail');
    panel.setAttribute('aria-labelledby', button.id);
    panel.innerHTML = `<p>${copy}</p>`;
    const bird = $('.signal-art');
    clearTimeout(birdActionTimer);
    bird.classList.remove('is-performing');
    bird.dataset.lens = button.dataset.eros;
    // Restart the finite action even when the same tab is selected again.
    void bird.offsetWidth;
    bird.classList.add('is-performing');
    birdActionTimer = setTimeout(() => bird.classList.remove('is-performing'), 1500);
  });

  const filterButtons = $$('[data-filter]');
  const cards = $$('.story-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    let count = 0;
    cards.forEach(card => {
      const show = button.dataset.filter === 'all' || button.dataset.filter === card.dataset.category;
      card.hidden = !show;
      if (show) { card.classList.add('visible'); count++; }
    });
    $('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'story' : 'stories'}`;
    updateScroll();
  }));

  const stories = {
  "journal-lush-investment": {
    "kicker": "INSIDE OCES / STUDIO DIARY · 2095",
    "title": "What funding makes possible.",
    "body": "<p class=\"article-byline\">OCES Journal · Inside the research studio · 2095</p><p>A new research phase begins quietly: with time at a workbench, a revised sample list and a question that can finally be followed further. Lush’s investment in OCES in 2095 opens that space for Project EROS Phase II.</p><h3>Room for an unanswered question.</h3><p>The first Bird Lingerie design is already in use. The next task is more uncertain. Does scent add meaningful information for a particular species? What happens when a candidate material holds or releases it? Funding allows the team to plan those comparisons without assuming the outcome.</p><h3>From a sketch to a sample.</h3><p>In the studio, Filo’s drawings become a sampling brief. Mesh, cotton and recovered offcuts are considered alongside movement and contact. Bibi’s team defines what must be observed and what would justify stopping. A promising visual idea still has to earn its place in a species-specific study.</p><h3>A different clock.</h3><p>Research time cannot be set by a product launch. Observation, material assessment and welfare review each need room in the schedule. The practical value of investment is the ability to support that sequence, including revisions and results that send a design back to the drawing board.</p><h3>The decisions stay with OCES.</h3><p>Support does not purchase a favourable finding. OCES retains the research brief and the decision to advance, change or discontinue a proposed intervention. A sample that fails can tell the team something a polished campaign cannot.</p><h3>The next page is still open.</h3><p>Phase II has begun with questions about scent, material interaction and species-specific courtship signals. This studio diary follows how those questions shape the work. It does not report completed trials, a funding amount or recovery results.</p>"
  },
  "protect": {
    "kicker": "OUR MISSION / SPECIES RECOVERY",
    "title": "Protect life. Protect possibility.",
    "body": "<p>Every endangered species carries a future that cannot be replaced. OCES protects that future by working on the conditions that make survival and reproduction possible.</p><h3>A national conservation institution.</h3><p>Established under the government’s wildlife recovery policy, OCES is responsible for endangered-species breeding, genetic management, artificial incubation, habitat restoration, individual monitoring and emergency breeding programmes.</p><h3>Start with the whole ecosystem.</h3><p>Our programmes connect habitat condition, access to food, nesting opportunities and breeding behaviour. A decline in one area changes the work required in the others.</p><ul><li>Monitor species and the pressures affecting their recovery.</li><li>Protect and reconnect feeding, shelter and nesting sites.</li><li>Develop species-specific interventions where observation identifies a need.</li><li>Review recovery across breeding seasons, rather than a single moment.</li></ul><h3>Recovery, with continuity.</h3><p>We keep the animal’s life at the centre of each decision. Our aim is a population able to feed, move, choose a mate and reproduce within a resilient habitat.</p>"
  },
  "awareness": {
    "kicker": "OUR MISSION / CLIMATE AWARENESS",
    "title": "Make the crisis visible.",
    "body": "<p>A disappearing forest is easy to recognise. A disappearing courtship signal is easier to miss. OCES makes both part of the public conversation.</p><h3>Show how a changing world changes a life.</h3><p>Our climate programme follows the relationship between habitat, food, plumage and reproduction. Field reports and public exhibitions translate these connected pressures into stories that people can understand and act on.</p><h3>Make room for questions.</h3><p>The OCES Journal publishes research updates, project progress and opposing perspectives. Support for conservation grows stronger when the public can examine what we are doing, why we are doing it and what remains uncertain.</p><p>Awareness is one of our four priorities because lasting conservation depends on sustained public attention, as well as scientific and financial support.</p>"
  },
  "design": {
    "kicker": "OUR MISSION / NON-HUMAN-CENTRED DESIGN",
    "title": "Design beyond the human.",
    "body": "<p>Our design brief begins with another species. Its perception, behaviour and physical needs set the direction of the work.</p><h3>Change the starting point.</h3><p>Project EROS studies avian courtship and translates those findings into Bird Lingerie: species-specific wearable designs developed around colour, form and movement.</p><p>Filo Sanspoil leads material and form development. Bibi connects the design work to species observation and welfare review. Each discipline challenges the assumptions of the other.</p><h3>From testing to use.</h3><p>In 2095, Orange-fronted Parakeet Bird Lingerie is formally in use after multiple rounds of experiments and testing. New designs for other bird species are now in development.</p><h3>A different measure of success.</h3><ul><li>Is the signal relevant to the intended species?</li><li>Can the bird fly, preen and display naturally?</li><li>Can the design be fitted, checked and removed safely?</li><li>Does the intervention offer a benefit beyond its visual appeal?</li></ul><p>A design advances when the evidence supports it. Animal welfare and habitat protection remain part of the brief at every stage.</p>"
  },
  "fund": {
    "kicker": "OUR MISSION / CONSERVATION FUNDING",
    "title": "Give ideas a research pathway.",
    "body": "<p>Conservation takes continuity. Field observation, restoration and responsible design all require support that lasts beyond the first idea.</p><h3>Three areas. One recovery pathway.</h3><ul><li><strong>Conservation research:</strong> seasonal observation, species monitoring and studies of climate-related pressure.</li><li><strong>Species-first prototypes:</strong> materials, colour and form development, followed by fit and welfare assessment.</li><li><strong>Habitat protection:</strong> restoration of feeding and nesting sites, and long-term stewardship.</li></ul><h3>Support the next stage.</h3><p>Orange-fronted Parakeet Bird Lingerie is formally in use after multiple rounds of experiments and testing. Project EROS’s new design work now focuses on additional bird species, alongside OCES’s continuing research and habitat priorities.</p><h3>Support that can be accounted for.</h3><p>Each programme defines its question, milestones and review criteria before work advances. OCES reports progress alongside limitations, including decisions to revise or stop an intervention.</p><p>We seek partners who value careful research, independent scrutiny and sustained care for endangered species.</p>"
  },
  "history": {
    "kicker": "OUR HISTORY / THE SILENT SKY EMERGENCY",
    "title": "A silent sky. A national response.",
    "body": "<h3>2078 / The balance begins to break.</h3><p>Warming and urban expansion fragment forests, beginning a sustained decline in bird populations.</p><h3>2083 / An Insect-Free World.</h3><p>Pesticides and automated insect-killing systems accelerate insect collapse. Disrupted food chains and declining pollination leave birds with less food and poorer nutrition.</p><h3>2085 / The courtship crisis.</h3><p>Poor nutrition, long-term pollution and a reversal in ozone-layer recovery increase UV-B exposure and weaken colour, iridescence and ultraviolet reflection. Birds may remain fertile but struggle to attract and recognise suitable mates. Falling breeding success brings quieter cities, resistant pest outbreaks and rising food prices.</p><h3>The Silent Sky Emergency.</h3><p>The government declared <strong>THE SILENT SKY EMERGENCY</strong> and introduced a new national wildlife recovery policy. Protecting endangered species became part of the national response to a wider ecological emergency.</p><h3>2093 / OCES is established.</h3><p>The government established the Organisation for the Conservation of Endangered Species during this response. Bibi and the conservation science team founded OCES in 2093 to put the new recovery policy into practice.</p><p>The Orange-fronted Parakeet crisis helped drive the organisation’s formation. The species became the focus of OCES’s first conservation programme.</p><h3>2094 / Design joins the mission.</h3><p>Filo Sanspoil joined OCES in 2094 after serving as Creative Director of Alexander McQueen. His expertise in colour, form and materials brought a new discipline into the organisation’s conservation work.</p><h3>2095 / From testing to use.</h3><p>Orange-fronted Parakeet Bird Lingerie has completed multiple rounds of experiments and testing and is now formally in use. Project EROS is developing new Bird Lingerie designs for other bird species.</p><p>Today, OCES connects species research, habitat protection, public understanding and non-human-centred design. Bibi’s scientific perspective and Filo Sanspoil’s design practice meet around avian courtship.</p><p>Our mandate began with an emergency. Our purpose is to give endangered species a future.</p>"
  },
  "parakeet": {
    "kicker": "OUR FIRST CONSERVATION PROGRAMME / 2093",
    "title": "Orange-fronted Parakeet.",
    "body": "<p>The Orange-fronted Parakeet crisis helped bring OCES into being. In 2093, the species became the focus of the organisation’s first conservation programme.</p><h3>A species at the beginning of the response.</h3><p>Its crisis formed part of the wider ecological pressures that led the government to declare THE SILENT SKY EMERGENCY and launch a national wildlife recovery policy.</p><p>For the newly established OCES, the parakeet provided a concrete starting point: understand the pressures on an endangered species, then connect the work needed for its recovery.</p><h3>Follow the whole life.</h3><p>Bibi and the conservation science team examine habitat, feeding conditions and breeding behaviour together. Protection must address the conditions in which a bird lives, as well as the signals it uses to find a mate.</p><h3>2095 / Bird Lingerie is in use.</h3><p>Under Project EROS, Bird Lingerie for the Orange-fronted Parakeet has completed multiple rounds of experiments and testing. The design is now formally in use.</p><h3>From the first programme to a wider mission.</h3><p>The parakeet remains part of the organisation’s founding story. Its crisis gives OCES’s approach a clear direction: connect conservation science, habitat priorities and species-specific design around the needs of the animal.</p><p>Project EROS is now developing Bird Lingerie for other bird species. Each new design responds to the needs of its own species, while habitat protection and welfare remain essential to the broader work.</p>"
  },
  "eros": {
    "kicker": "PROJECT EROS / IN USE & IN DEVELOPMENT · 2095",
    "title": "Designed for their desire.",
    "body": "<p>Project EROS — <strong>Endangered Reproductive Ornamentation System</strong> — connects conservation science with design to address disrupted avian courtship signals. Bird Lingerie is its programme of species-specific wearable designs, developed around a bird’s own perception, behaviour and movement.</p><h3>2095 / The first design is in use.</h3><p>Bird Lingerie for the <strong>Orange-fronted Parakeet</strong> has completed multiple rounds of experiments and testing. It is now formally in use within OCES’s first conservation programme.</p><h3>Still fertile. Struggling to attract.</h3><p>In the 2095 programme, only four reproductively viable Golden-headed Quetzals remain worldwide. Their bodies are still capable of reproduction, but environmental damage has weakened the displays they use to attract one another.</p><h3>The next chapter is already in development.</h3><p>Project EROS is now developing Bird Lingerie for other bird species. Each new design begins with the signals and needs of its intended species. The work creates a distinct brief for each bird, with its own colour, form and movement requirements.</p><h3>One programme. Two disciplines.</h3><p>Bibi connects the ecological and behavioural questions with conservation science. Filo Sanspoil, who joined OCES in 2094, leads Bird Lingerie design. Their work brings scientific observation and design development into the same process.</p><h3>How the next designs develop.</h3><div class=\"prototype-steps\"><div><strong>01 / OBSERVE</strong><p>Study the intended species’ courtship behaviour, plumage and environmental pressures.</p></div><div><strong>02 / DESIGN</strong><p>Develop colour, form and fitting approaches around its existing displays and movements.</p></div><div><strong>03 / TEST</strong><p>Assess perception, fit, feather contact and freedom of movement. Experiments and welfare review inform revisions.</p></div><div><strong>04 / REVIEW</strong><p>Review the evidence for that species before deciding whether a design is ready for use.</p></div></div><h3>Care beyond the wearable.</h3><p>EROS sits within OCES’s wider recovery mission. Habitat protection, feeding conditions and animal welfare remain part of the work, both for designs in use and for those still being developed.</p>"
  },
  "birdlingerie": {
    "kicker": "BIRD LINGERIE / SPECIES-SPECIFIC DESIGN · 2095",
    "title": "Their signals. Their choices.",
    "body": "<p>Bird Lingerie is Project EROS’s family of species-specific wearable designs. Its purpose is to support avian courtship through the colour, form and movement birds already use to attract a mate.</p><h3>An official name.</h3><p>Bird Lingerie is the term adopted by OCES for its courtship wearables.</p><blockquote>“Lingerie has always been designed to enhance attraction. We simply stopped designing it exclusively for humans.”</blockquote><h3>Why it exists.</h3><p>In 2095, changes to food, habitat and environmental exposure are part of the breeding crisis. A bird may survive while its courtship signals become less distinct. Bird Lingerie addresses those signals within OCES’s wider conservation work.</p><h3>Already in use.</h3><p>The Orange-fronted Parakeet design has completed multiple rounds of experiments and testing and is now formally in use.</p><h3>Now developing for other species.</h3><p>Project EROS is developing new Bird Lingerie designs for other birds. Each brief starts with the species’ existing display. Colour and contrast follow its perception; fit follows its body and plumage; form responds to the movements used in courtship.</p><ul><li><strong>Great Tit:</strong> strengthen the yellow breast signal affected by pollution, heavy metals and poorer food quality.</li><li><strong>Atlantic Puffin:</strong> intensify breeding-season colour signals around the bill and feet.</li><li><strong>Golden-headed Quetzal:</strong> restore and amplify the visual effect of iridescent plumage.</li></ul><p>These species briefs are in development. Each requires separate testing; the formally deployed design remains the Orange-fronted Parakeet.</p><h3>The bird sets the brief.</h3><p>The word “lingerie” refers to attraction and reproduction. The designs respond to birds’ own mating behaviour. Flight, preening, feather condition and safe removal guide design and welfare review.</p><p>Food security, connected habitat and animal welfare remain essential to the conservation programme around every design.</p>"
  },
  "bibi": {
    "kicker": "THE PEOPLE BEHIND OCES / SCIENCE",
    "title": "Bibi",
    "body": "<p class=\"profile-role\">OCES Official & Scientist</p><p>Bibi co-founded OCES with the conservation science team in 2093, as the government established the organisation under its new national wildlife recovery policy.</p><p>She connects species research with OCES’s conservation programmes. Her work follows how changing habitats, food availability and environmental pressure affect birds’ condition and breeding behaviour.</p><h3>Science that shapes the work.</h3><p>Within Project EROS, Bibi translates field observations into a clear research brief: which signal is changing, how a species perceives it, and what evidence is needed to assess an intervention.</p><p>She works with Filo Sanspoil to review colour studies, fit and movement against the needs of the intended species. Welfare considerations guide the process from the first material sample to decisions about further assessment.</p><h3>The programme in 2095.</h3><p>Orange-fronted Parakeet Bird Lingerie has completed multiple rounds of experiments and testing and is now formally in use. As EROS develops designs for other bird species, Bibi connects each new brief with the scientific questions and welfare needs of that species.</p><h3>Her responsibilities.</h3><ul><li>Coordinate species observation and conservation research.</li><li>Define the ecological and behavioural questions behind each project.</li><li>Connect prototype review with animal welfare and habitat priorities.</li><li>Communicate findings, limitations and programme decisions.</li></ul><blockquote>“A future for a species begins with understanding its life.”</blockquote><p>For Bibi, scientific care means knowing when to develop an idea, when to change it and when the most useful action is to restore the world around the animal.</p>"
  },
  "sam": {
    "kicker": "THE PEOPLE BEHIND OCES / DESIGN",
    "title": "Filo Sanspoil",
    "body": "<p class=\"profile-role\">Chief Bird Lingerie Designer<br>Former Creative Director of Alexander McQueen</p><p>Filo Sanspoil joined OCES in 2094 after serving as Creative Director of Alexander McQueen, bringing his creative leadership and design experience to its conservation mission. As Chief Bird Lingerie Designer, he works on the signals birds use to find a mate.</p><h3>From luxury. To life.</h3><p>His earlier career developed a close attention to silhouette, colour, material and construction. At OCES, those skills respond to a different user. A species’ perception and movement determine which choices matter.</p><p>Filo Sanspoil leads the design development of Bird Lingerie, working with Bibi to connect avian courtship research with material and form studies. His role is to make a design precise enough to be examined, tested and improved.</p><h3>The next species. The next brief.</h3><p>Orange-fronted Parakeet Bird Lingerie is now formally in use after multiple rounds of experiments and testing. In 2095, Filo Sanspoil’s design work continues through new Bird Lingerie designs for other bird species, each with its own courtship signals and physical needs.</p><h3>His responsibilities.</h3><ul><li>Translate species-specific courtship signals into design briefs.</li><li>Develop colour, form, construction and material samples.</li><li>Review fit, feather contact and freedom of movement with the science team.</li><li>Document design decisions and revise them in response to assessment.</li></ul><blockquote>“Desire already has a language. Our work begins by listening to it.”</blockquote><p>For Filo Sanspoil, the quality of a design is measured through its relevance to the animal’s life.</p>"
  },
  "journal-signal": {
    "kicker": "RESEARCH / FIELD NOTES · 2095",
    "title": "What happens when nature’s signals fade?",
    "body": "<p class=\"article-byline\">OCES Research Desk · Research briefing · 2095</p><p>A bird’s courtship display connects its body with the environment it lives in. Food, plumage and movement all become part of the signal another bird encounters.</p><h3>Three linked pressures.</h3><p>The “Insect-Free World” removes food. Deforestation separates habitats. Long-term pollution and a reversal in ozone-layer recovery increase UV-B exposure. Together, these pressures undermine nutrition, encounters and courtship signals.</p><h3>Follow the signal upstream.</h3><p>OCES’s 2095 research programme examines how changes to feeding conditions and habitat relate to the displays recorded during breeding. We consider body condition, plumage and behaviour together, rather than treating colour as an isolated detail.</p><h3>The Avian Food Inflation.</h3><p>As birds lose their role in pest control, resistant insects rebound and agricultural costs rise. In the 2095 setting, ordinary Tesco strawberries cost £8, while “Natural Avian Certified Strawberries” cost £24. Cities grow quieter, and an authentic dawn chorus becomes a scarce experience.</p><h3>Ask what the bird can see.</h3><p>A display that appears convincing to a human observer may carry a different meaning for the intended species. Project EROS therefore begins with species-specific perception and existing courtship behaviour.</p><h3>Turn observation into a brief.</h3><p>Bibi identifies the biological question. Filo Sanspoil develops colour and form studies that make that question testable. The work then returns to assessment: is the signal relevant, is movement preserved, and is an intervention justified?</p><h3>A different stage for each species.</h3><p>Orange-fronted Parakeet Bird Lingerie is formally in use after multiple rounds of experiments and testing. EROS’s current development work focuses on new designs for other bird species, with each brief assessed against that species’ needs. Habitat and nutrition remain part of the same recovery pathway.</p>"
  },
  "journal-support": {
    "kicker": "PERSPECTIVE / IN SUPPORT · 2095",
    "title": "Conservation needs new imagination.",
    "body": "<p class=\"article-byline\">OCES Journal · Editorial perspective · 2095</p><p>Conservation needs the ability to see a familiar problem from a different point of view. Project EROS asks design to look closely at an endangered bird’s experience of attraction and reproduction.</p><h3>Give an overlooked need a form.</h3><p>Bird Lingerie brings colour, movement and perception into a tangible design brief. It opens a conversation about reproductive barriers that can remain invisible when protection focuses only on population counts or the physical landscape.</p><p>Design contributes a way to connect disciplines. An observation can become a material sample; a behavioural question can become a fitting constraint; a prototype can reveal which assumptions still need to be examined.</p><h3>A first design in use.</h3><p>Orange-fronted Parakeet Bird Lingerie has completed multiple rounds of experiments and testing and is now formally in use. This milestone gives EROS a concrete starting point as it develops new designs for other bird species.</p><h3>Imagination must stay accountable.</h3><p>The argument for EROS rests on responsible development. Designs should advance through species-specific research and welfare review, with resources also committed to food and habitat.</p><p>Exploring a new tool does not require believing it will work in every case. It requires a clear question, a careful process and the willingness to change direction when the evidence asks for it.</p>"
  },
  "journal-founding": {
    "kicker": "INSIDE OCES / THE NATIONAL RESPONSE · 2095",
    "title": "A different organisation. A different possibility.",
    "body": "<p class=\"article-byline\">OCES Journal · Organisation briefing · 2095</p><p>The crisis was becoming impossible to separate from everyday life. Food prices were rising, pest pressure was escalating, ecosystems were falling out of balance and urban environmental problems were worsening.</p><h3>An emergency with a national response.</h3><p>The government declared THE SILENT SKY EMERGENCY and introduced a new national wildlife recovery policy. OCES was established as part of that response.</p><h3>A beginning in 2093.</h3><p>Bibi and the conservation science team founded the Organisation for the Conservation of Endangered Species in 2093. The Orange-fronted Parakeet crisis helped drive its formation and became the focus of its first conservation programme.</p><h3>A new discipline in 2094.</h3><p>Filo Sanspoil joined OCES in 2094 after serving as Creative Director of Alexander McQueen. His skills in colour, materials and form opened a new conversation about the signals birds use in courtship.</p><h3>The work in 2095.</h3><p>Orange-fronted Parakeet Bird Lingerie has completed multiple rounds of experiments and testing and is now formally in use. Project EROS is developing new designs for other bird species.</p><p>Science and design remain connected within OCES’s wider recovery mission. Habitat, food, welfare and breeding behaviour are part of the same conservation question.</p><p>The organisation’s four priorities give that work continuity: protect endangered species, make the climate crisis visible, design around non-human needs and sustain conservation through funding and partnerships.</p>"
  },
  "journal-prototype": {
    "kicker": "PROJECT EROS / PROGRAMME UPDATE · 2095",
    "title": "From testing. To use.",
    "body": "<p class=\"article-byline\">OCES Research & Design · Programme update · 2095</p><p>Project EROS has reached a new stage. Bird Lingerie for the Orange-fronted Parakeet has completed multiple rounds of experiments and testing and is now formally in use.</p><h3>The 2095 emergency press conference.</h3><p>OCES EMERGENCY PRESS CONFERENCE — PROJECT EROS, 2095 brings the conservation and reproductive crisis before the public. OCES presents the programme to attract funding, communicate the urgency and expand its public reach. Jasmine represents FREE, challenging the management of avian desire and mate choice.</p><h3>The first species. A new milestone.</h3><p>The Orange-fronted Parakeet crisis helped drive OCES’s formation in 2093. As the organisation’s first conservation programme, the species now also marks EROS’s transition from experimental design to use.</p><p>That milestone belongs to the Orange-fronted Parakeet design. Every additional species brings a new set of needs and a separate development process.</p><h3>What we are working on now.</h3><p>In 2095, Project EROS is developing Bird Lingerie for other bird species. The new designs begin with species-specific courtship signals, perception, body shape and movement.</p><p>Great Tit, Atlantic Puffin and Golden-headed Quetzal design briefs are part of this development work. Colour, form and feather-friendly construction are considered in relation to each bird’s own display.</p><h3>Science and design move together.</h3><p>Bibi connects the work with conservation research and animal welfare. Filo Sanspoil leads Bird Lingerie design, bringing creative leadership and expertise in material and form from his previous role as Creative Director of Alexander McQueen.</p><p>The next chapter builds on the first programme’s experience while keeping every new species at the centre of its own brief.</p><div class=\"article-record\"><strong>Programme status / 2095</strong><br>Orange-fronted Parakeet: multiple rounds of experiments and testing completed; Bird Lingerie formally in use.<br>Other bird species: new Bird Lingerie designs in development.</div>"
  },
  "journal-sam": {
    "kicker": "PEOPLE / DESIGN · 2095",
    "title": "From luxury. To life.",
    "body": "<p class=\"article-byline\">OCES Journal · In conversation with Filo Sanspoil · 2095</p><p>Previously Creative Director of Alexander McQueen, Filo Sanspoil joined OCES in 2094. His move from luxury design to conservation changed the audience for his work. The central question became how a bird experiences colour, form and movement.</p><blockquote>“Desire already has a language. Our work begins by listening to it.”</blockquote><h3>The brief changes everything.</h3><p>A silhouette must leave room for flight. A fastening must be assessed against feather contact and safe removal. A colour must be relevant to the species that sees it.</p><p>Within Project EROS, Filo Sanspoil works with Bibi to turn biological observations into material and form studies. Precision still matters, but it is measured against another animal’s needs.</p><h3>A design moves into use.</h3><p>In 2095, Orange-fronted Parakeet Bird Lingerie has completed multiple rounds of experiments and testing and is formally in use. Filo Sanspoil is now developing new designs for other bird species through Project EROS.</p><h3>Craft meets scrutiny.</h3><p>The design process records how each decision affects fit, movement and signalling. Samples are revised as the science and welfare review develops.</p><p>For OCES’s Chief Bird Lingerie Designer, the work is a continuation of close attention to detail, with a wider responsibility attached to every choice.</p>"
  },
  "support": {
    "kicker": "FUNDING / THE 2095 PROGRAMME",
    "title": "Choose a future to support.",
    "body": "<p class=\"article-record\"><strong>A national recovery mandate.</strong><br>OCES was established by the government in 2093 as part of the wildlife recovery policy introduced following THE SILENT SKY EMERGENCY.</p><p>OCES directs support towards conservation research, species-first design and habitat protection. Each funding area connects to a defined programme of work.</p><div class=\"support-options\" role=\"group\" aria-label=\"Choose a funding area\"><button data-support=\"science\" aria-pressed=\"true\">Conservation research <span aria-hidden=\"true\">↗</span></button><button data-support=\"prototype\" aria-pressed=\"false\">Species-first prototypes <span aria-hidden=\"true\">↗</span></button><button data-support=\"habitat\" aria-pressed=\"false\">Habitat protection <span aria-hidden=\"true\">↗</span></button></div><div class=\"support-selection\" aria-live=\"polite\"><strong id=\"support-heading\">Make recovery measurable.</strong><p id=\"support-copy\">Support seasonal field observation, habitat mapping and species-specific studies of food, plumage and breeding behaviour. These records guide every conservation and design decision.</p></div><h3>What support makes possible.</h3><p>Research funding sustains seasonal observations and species records. With Orange-fronted Parakeet Bird Lingerie formally in use after multiple rounds of experiments and testing, prototype funding now supports development for additional bird species through material, colour and welfare assessment. Habitat funding protects the feeding and nesting conditions that recovery depends on.</p><h3>How progress is reviewed.</h3><p>Programme milestones include the question being investigated, the work completed, the evidence collected and the decision about what comes next. OCES reports limitations as part of that record.</p><p>Long-term support helps conservation teams maintain continuity across breeding seasons and gives each project the time required to learn.</p>"
  },
  "partnership": {
    "kicker": "PARTNERSHIPS / PROGRAMME FRAMEWORK",
    "title": "Different strengths. One living future.",
    "body": "<p>OCES was established under the government’s national wildlife recovery policy. Partnerships extend the research, design and habitat expertise available to that mission.</p><p>The organisation brings together skills that a species recovery programme needs: ecological understanding, responsible design and sustained support for habitats.</p><h3>Research partnerships.</h3><p>Contribute expertise in ecology, avian perception, nutrition, behaviour or welfare assessment. Work begins with a shared research question and clear methods for observation and review.</p><h3>Design partnerships.</h3><p>In 2095, EROS is developing Bird Lingerie for other bird species following the transition of the Orange-fronted Parakeet design into formal use after multiple rounds of experiments and testing.</p><p>Contribute material knowledge, construction methods and prototyping capacity. Designs are assessed against species-specific fit, movement and signalling requirements.</p><h3>Habitat partnerships.</h3><p>Support restoration, site stewardship and monitoring. Programmes connect feeding and nesting habitats with the communities and specialists who care for them.</p><h3>A shared process.</h3><ol><li><strong>Define the contribution.</strong> Identify the species need, expertise and resources involved.</li><li><strong>Set the brief.</strong> Agree on methods, programme milestones and welfare criteria.</li><li><strong>Review the work.</strong> Document findings and make the next decision against the original brief.</li><li><strong>Share the record.</strong> Report progress, limitations and how resources were used.</li></ol><p>Partners join a conservation programme with a responsibility to the species at its centre.</p><p><a href=\"partnership.html\">Explore the full partnership programme and LUSH × OCES →</a></p>"
  },
  "preview": {
    "kicker": "PROJECT COLOPHON",
    "title": "OCES. A world in 2095.",
    "body": "<p>This website presents the fictional Organisation for the Conservation of Endangered Species as an official organisation within an academic worldbuilding project.</p><h3>The setting.</h3><p>The present-day timeline is 2095. The timeline begins in 2078, with severe ecological deterioration in 2083 and a courtship crisis in 2085. These dates follow the project author’s setting; the events draw on the supplied worldbuilding document.</p><p>Rising food prices, pest pressure, ecological imbalance and urban environmental problems led the government to declare THE SILENT SKY EMERGENCY and introduce a national wildlife recovery policy.</p><p>The government established OCES during this response. Bibi and the conservation science team founded it in 2093. The Orange-fronted Parakeet crisis helped drive its formation and became its first conservation programme. Filo Sanspoil joined in 2094.</p><h3>The people and the project.</h3><p>Bibi is an OCES official and scientist. Filo Sanspoil is the Chief Bird Lingerie Designer and former Creative Director of Alexander McQueen. Project EROS connects their disciplines through non-human-centred design for avian courtship.</p><p>In 2095, Orange-fronted Parakeet Bird Lingerie has completed multiple rounds of experiments and testing and is formally in use. Project EROS is developing new Bird Lingerie designs for other bird species.</p><h3>The wider crisis.</h3><p>The source world includes the commercial Insect-Free World, the Avian Food Inflation and a Golden-headed Quetzal population with only four reproductively viable individuals. FREE stands for Front for Reproductive Ethics &amp; Ecological Autonomy; Jasmine is its representative. The 2095 emergency press conference presents EROS to the public and seeks funding.</p><h3>Reading the site.</h3><p>The organisation, programme records, profiles and journal articles belong to this imagined world. They are authored narrative content, rather than reports of real-world conservation results. The 100% species-first statement expresses a design principle.</p><h3>Visual authorship.</h3><p>The OCES logo and portrait references were supplied by the project author. The site’s year mark and conservation illustrations are original vector artwork. AI-assisted portraits, photography and typography are documented in the Image credits.</p><h3>Research and design archive.</h3><p>The species research section places sourced biological background beside the fictional 2095 programme record. It includes 17 author-supplied notebook photographs and three AI-assisted concept sheets. Six photographs from the latest designer notebook explore colour, fit, headpieces, recognition markings and customisation. Comparative bird studies, early planning notes and added visual directions are identified separately from confirmed programme progress.</p><h3>Product figures.</h3><p>The product feature uses illustrative figures authored for the fictional 2095 scenario: a 32% baseline courtship success rate and a 48% rate with EROS. The difference is 16 percentage points, equivalent to a 50% relative increase. These figures are identified in the feature and explained in Read the results; they are not real-world experimental findings.</p><h3>The material brief.</h3><p>Recycled nylon mesh, organic cotton binding and reclaimed textile offcuts form the authored material palette for the fictional 2095 programme. These materials were selected for the website narrative; the real textile photograph illustrates fabric texture and does not establish the composition or certification of an actual prototype.</p>"
  },
  "credits": {
    "kicker": "PROJECT COLOPHON / VISUAL CREDITS",
    "title": "A world worth looking at.",
    "body": "<p>Landscape photography from Unsplash and Pexels provides the site’s visual setting. The photographs illustrate habitats and landscapes; they do not document OCES field locations.</p><ul><li><a href=\"https://images.unsplash.com/photo-1441974231531-c6227db76b6e\" target=\"_blank\" rel=\"noopener noreferrer\">Sunlight in the forest</a></li><li><a href=\"https://images.unsplash.com/photo-1470770841072-f978cf4d019e\" target=\"_blank\" rel=\"noopener noreferrer\">Mountain lake</a></li><li><a href=\"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b\" target=\"_blank\" rel=\"noopener noreferrer\">Mountain peak</a></li><li><a href=\"https://images.unsplash.com/photo-1448375240586-882707db888b\" target=\"_blank\" rel=\"noopener noreferrer\">Forest canopy</a></li></ul><h3>Opening landscape.</h3><p>The landscape image was supplied by the project author on 6 October 2026 and is used unchanged, with a responsive display crop. It is a supplied visual reference; the website does not describe it as documentary photography. The layout adds no gradient or mask.</p><h3>OCES identity and portraits.</h3><p>The green circular bird logo and source photographs of Bibi and Filo Sanspoil were supplied by the project author. The portraits were restyled with AI and prepared as monochrome cutouts for the team posters.</p><h3>Typography and illustration.</h3><p>The 2095 year mark, conservation icons and EROS parrot illustration are original SVG illustrations. The site uses system typography with the bundled Inter variable font, distributed under the SIL Open Font License. Team poster headings use the local Impact / Arial Narrow font stack.</p><h3>Visual reference.</h3><p><a href=\"https://www.apple.com/environment/\" target=\"_blank\" rel=\"noopener noreferrer\">Apple Environment</a> informed the use of large typography, generous spacing, landscape imagery and bright green highlights.</p><h3>The design archive.</h3><p>The archive includes nine studio photographs of the first Bird Lingerie design, supplied by the project author. Their backgrounds were removed with imagegen; the original source files are preserved alongside the transparent display assets. It also contains 23 original photographs supplied by the project author: 17 earlier notebook photographs, three additional notebook scans and three hand-modelling photographs. All originals are preserved unchanged. The three model photographs form one parallel study of body contours and precise fit. One earlier AI-generated graphite concept study, A lighter kind of technology, remains separate from the original photographs and programme testing records.</p><p>The species background links to the Department of Conservation and New Zealand Birds Online. The OCES programme record and Bird Lingerie remain part of the academic project’s 2095 world.</p><h3>Orange-fronted Parakeet photograph.</h3><p>The real-world species photograph is by <a href=\"https://commons.wikimedia.org/wiki/File:Cyanoramphus_malherbi_595565405.jpg\" target=\"_blank\" rel=\"noopener noreferrer\">Genevieve Early</a>, photographed in New Zealand on 28 November 2025. Source: <a href=\"https://www.inaturalist.org/photos/595565405\" target=\"_blank\" rel=\"noopener noreferrer\">iNaturalist</a>, via Wikimedia Commons. Used under <a href=\"https://creativecommons.org/licenses/by/4.0/\" target=\"_blank\" rel=\"noopener noreferrer\">Creative Commons Attribution 4.0 International</a>. The original file is preserved; its full proportions are retained on desktop and mobile. This photograph provides a real-world species reference for the fictional OCES programme.</p><h3>Technical fabric concept.</h3><p>The pale ultra-fine weave with subtle iridescence is an AI-generated material study, created with the built-in imagegen tool at the project author’s request. It is not a documentary photograph or a tested material sample.</p><h3>Hand-modelling photographs.</h3><p>The project author supplied the three photographs of the physical parakeet model. The original files are preserved without pixel edits and shown as a parallel study of fit and form.</p><h3>Timeline photography.</h3><p>Each of the six milestones has a new, dedicated photograph that appears only in the timeline. These are real-world photographic references for the fictional future events. The flying Rose-ringed Parakeet is a comparative reference for feather structure and natural wing movement, rather than an Orange-fronted Parakeet or an EROS test record. Hummingbird plumage illustrates iridescence, while the Atlantic Puffin photograph shows real courtship billing as a comparative behavioural reference.</p><ul><li>2078: <a href=\"https://www.pexels.com/photo/empty-felled-area-among-evergreen-forest-3551209/\" target=\"_blank\" rel=\"noopener noreferrer\">Empty felled area among evergreen forest</a> — Aleksey Kuprikov; <a href=\"https://www.pexels.com/license/\" target=\"_blank\" rel=\"noopener noreferrer\">Pexels License</a>.</li><li>2083: <a href=\"https://www.pexels.com/photo/a-macro-shot-of-a-bee-on-a-flower-7899581/\" target=\"_blank\" rel=\"noopener noreferrer\">A Macro Shot of a Bee on a Flower</a> — Egor Kamelev; <a href=\"https://www.pexels.com/license/\" target=\"_blank\" rel=\"noopener noreferrer\">Pexels License</a>.</li><li>2085: <a href=\"https://www.pexels.com/photo/close-up-of-a-colorful-hummingbird-feather-29526831/\" target=\"_blank\" rel=\"noopener noreferrer\">Close-Up of a Colorful Hummingbird Feather</a> — Arian Fernandez; <a href=\"https://www.pexels.com/license/\" target=\"_blank\" rel=\"noopener noreferrer\">Pexels License</a>.</li><li>2093: <a href=\"https://commons.wikimedia.org/wiki/File:Cyanoramphus_malherbi_464242365.jpg\" target=\"_blank\" rel=\"noopener noreferrer\">Cyanoramphus malherbi 464242365</a> — William Harland; <a href=\"https://creativecommons.org/licenses/by/4.0/\" target=\"_blank\" rel=\"noopener noreferrer\">CC BY 4.0</a>.</li><li>2094: <a href=\"https://www.pexels.com/photo/green-parrot-flying-16306375/\" target=\"_blank\" rel=\"noopener noreferrer\">Green Parrot Flying</a> — Siegfried Poepperl; <a href=\"https://www.pexels.com/license/\" target=\"_blank\" rel=\"noopener noreferrer\">Pexels License</a>.</li><li>2095: <a href=\"https://commons.wikimedia.org/wiki/File:Atlantic_puffins_courtship_billing_(4188074660).jpg\" target=\"_blank\" rel=\"noopener noreferrer\">Atlantic puffins courtship billing</a> — U.S. Fish and Wildlife Service; <a href=\"https://creativecommons.org/licenses/by/2.0/\" target=\"_blank\" rel=\"noopener noreferrer\">CC BY 2.0</a>. Genuine courtship photography used as a comparative reference.</li></ul><p>The photographs are preserved as downloaded. Responsive CSS applies display crops to the stock photographs; the Orange-fronted Parakeet and flight-study photographs retain their full proportions.</p>"
  },
  "principles": {
    "kicker": "ABOUT OCES / OUR PRINCIPLES",
    "title": "Life sets the standard.",
    "body": "<p>OCES brings science and design together under one commitment: the needs of the species come first.</p><h3>Understand before intervening.</h3><p>Observation defines the problem. An intervention must respond to a species-specific need and be considered alongside habitat and food conditions.</p><h3>Respect movement and choice.</h3><p>Flight, preening, feather condition and natural behaviour remain part of every design brief. Fit and safe removal are assessed throughout development.</p><h3>Make decisions from evidence.</h3><p>A design’s visual appeal does not establish its value to an animal. Assessment must examine relevance, welfare and the possibility of unintended effects.</p><h3>Keep the work open to scrutiny.</h3><p>OCES publishes research updates and welcomes critical perspectives. Progress includes the decisions to revise, delay or discontinue an approach.</p><p>These principles connect our four priorities: protect life, make the climate crisis visible, design beyond human needs and fund the future of conservation.</p>"
  },
  "research-parakeet": {
    "kicker": "SPECIES DOSSIER / ORANGE-FRONTED PARAKEET",
    "title": "Small species. A complete design brief.",
    "body": "<p class=\"article-byline\">OCES Research &amp; Design / Programme record, 2095</p><h3>Begin with the bird.</h3><p>The Orange-fronted Parakeet, or kākāriki karaka (<i>Cyanoramphus malherbi</i>), is a small New Zealand forest parakeet with green plumage, a yellow crown and an orange frontal band. It nests and roosts in tree cavities and feeds on seeds, buds, flowers and invertebrates. Food availability is closely connected to its breeding opportunities.</p><p>Species background: <a href=\"https://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/nz-parakeet-kakariki/orange-fronted-parakeet/\" target=\"_blank\" rel=\"noopener noreferrer\">Department of Conservation</a> and <a href=\"https://www.nzbirdsonline.org.nz/species/orange-fronted-parakeet\" target=\"_blank\" rel=\"noopener noreferrer\">New Zealand Birds Online</a>.</p><h3>Food and breeding.</h3><p>A bird of New Zealand’s South Island beech forests, the Orange-fronted Parakeet forms monogamous pairs and can breed in any month. Beech seeds become especially important during mast years; some pairs produce three or four successive clutches when food is plentiful.</p><h3>The 2095 habitat brief.</h3><p>In the project’s world, deforestation and climate-linked wildfire reduce beech forests, feeding resources and nesting habitat. The first conservation programme must address those conditions alongside courtship signals.</p><h3>The OCES research question.</h3><p>Within the 2095 programme, the brief connects habitat and food pressures with plumage, visual signalling and courtship. Bibi leads the scientific perspective; Filo Sanspoil translates the species brief into colour, material and form studies.</p><p>Habitat recovery, nutrition and observation remain part of the programme. The wearable intervention addresses a specific signalling question within that wider conservation work.</p><h3>From experiment to use.</h3><p>The Orange-fronted Parakeet crisis helped drive the founding of OCES in 2093 and became its first conservation programme. By 2095, its Bird Lingerie has completed multiple rounds of experiments and testing and is formally in use. Project EROS now develops designs for additional bird species.</p><h3>Three questions for every design.</h3><ol><li><strong>What does the bird perceive?</strong> Start with species-specific colour, contrast and recognition.</li><li><strong>How does the bird move?</strong> Consider the wings, feathers, preening and natural behaviour throughout construction.</li><li><strong>What does the evidence support?</strong> Assess material, fit and welfare; keep visual exploration distinct from testing records.</li></ol><h3>Reading the design archive.</h3><p>The latest designer notebook includes colour studies, wearable fit, headpiece construction, recognition markings and questions about customisation. Its handwritten notes document design exploration. The earlier project notebook includes construction sketches, comparative Great Tit studies, research maps and early worldbuilding notes. These pages preserve the studio process; early questions and alternative ideas are not automatically adopted as the current programme record.</p><p>One additional illustrated sheet explores a lightweight technology direction. It is a conceptual design manuscript, with no implied test results for that illustrated garment.</p>"
  },
  "eros-results": {
    "kicker": "PROJECT EROS / PROGRAMME FIGURES · 2095",
    "title": "A stronger signal. A clearer response.",
    "body": "<p class=\"article-byline\">Orange-fronted Parakeet / 2095 programme scenario</p><p>Bird Lingerie is formally in use for the Orange-fronted Parakeet after multiple rounds of experiments and testing. This product feature presents a set of illustrative figures within the academic project’s fictional 2095 world.</p><h3>The comparison.</h3><div class=\"article-record\"><strong>Successful courtship</strong><br>Baseline, without the wearable: <strong>32%</strong><br>With EROS Bird Lingerie: <strong>48%</strong><br>Absolute difference: <strong>16 percentage points</strong><br>Relative increase: <strong>50%</strong></div><h3>What success means here.</h3><p>For this scenario, courtship success means an observed display receives a reciprocal courtship response from a potential mate. Each percentage refers to the share of courtship encounters meeting that definition.</p><p>The feature describes courtship response, rather than a hormone measurement, egg count, breeding success rate or population recovery result. Those are separate outcomes.</p><h3>Reading the increase.</h3><p>The success rate rises from 32% to 48%. That is 16 percentage points higher. Dividing that difference by the 32% baseline gives a 50% relative increase: (48 − 32) ÷ 32 × 100.</p><h3>The 2095 programme.</h3><p>Orange-fronted Parakeet Bird Lingerie is formally in use. Project EROS is developing designs for other bird species, each with its own perception, body shape and courtship signals.</p><p>Habitat, nutrition, welfare and freedom of movement remain part of the conservation brief around the wearable.</p><div class=\"article-note\">Academic project note: the percentages above are authored fictional programme figures for the website’s 2095 scenario. They are not real-world experimental evidence. The technical-fabric macro is an AI-generated material concept.</div>"
  },
  "eros-materials": {
    "kicker": "BIRD LINGERIE / MATERIAL STUDY",
    "title": "Light, in every fibre.",
    "body": "<p>Ultra-fine technical fabric opens a new material direction for Bird Lingerie: a pale, delicate weave with a restrained iridescent response.</p><h3>Structure, up close.</h3><p>Fine filaments and a light, open construction guide the proposed panels. The designer studies how the fabric drapes over the parakeet model, where seams sit and how the cut follows its contours.</p><h3>A quiet reflection.</h3><p>A slight iridescent glint becomes one variable within the species-specific visual brief. Its colour and reflectance need to be considered from the bird’s perspective.</p><h3>Contact and movement.</h3><p>Soft edges, panel placement and freedom of movement remain part of the prototype review. Feather contact, preening and welfare guide development alongside the pursuit of a precise fit.</p><p class=\"article-note\">This is a material proposal within the fictional 2095 design project. The technical-fabric macro is an AI-generated concept image, not a photograph of a manufactured garment or a tested material sample.</p>"
  }
};
  const dialog = $('.story-dialog');
  let lastTrigger;
  $$('[data-story]').forEach(trigger => trigger.addEventListener('click', () => {
    const story = stories[trigger.dataset.story];
    if (!story) return;
    lastTrigger = trigger;
    $('#dialog-kicker').textContent = story.kicker;
    $('#dialog-title').textContent = story.title;
    $('#dialog-body').innerHTML = story.body;
    closeMenu();
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    $('.dialog-close').focus();
  }));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (lastTrigger) lastTrigger.focus({ preventScroll: true }); });
  const supportCopy = {
  "science": [
    "Make recovery measurable.",
    "Support seasonal field observation, habitat mapping and species-specific studies of food, plumage and breeding behaviour. These records guide every conservation and design decision."
  ],
  "prototype": [
    "Develop designs for the next species.",
    "Support Bird Lingerie development for additional bird species. Funding connects species-specific colour and form studies with material samples, fit assessment and welfare review."
  ],
  "habitat": [
    "Keep a living world connected.",
    "Support restoration of feeding and nesting sites, reconnect fragmented habitat, and sustain long-term monitoring. A courtship signal can only matter if a species still has a world to live in."
  ]
};
  $('#dialog-body').addEventListener('click', event => {
    const button = event.target.closest('[data-support]');
    if (!button) return;
    $$('[data-support]', dialog).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const [heading, copy] = supportCopy[button.dataset.support];
    $('#support-heading').textContent = heading;
    $('#support-copy').textContent = copy;
  });
  // Design sheets use their DOM image sources so portable HTML retains the archive.
  const archiveViewer = $('#archive-viewer');
  const archiveSheets = $$('[data-archive-source]').map(source => ({
    id: source.dataset.archiveSource,
    order: Number(source.dataset.archiveOrder),
    src: source.getAttribute('src'),
    title: source.dataset.archiveTitle,
    caption: source.dataset.archiveCaption,
    kind: source.dataset.archiveKind,
    orientation: source.dataset.archiveOrientation
  })).sort((a,b) => a.order - b.order);
  let archiveIndex = 0;
  let archiveTrigger;
  const showArchiveSheet = index => {
    archiveIndex = (index + archiveSheets.length) % archiveSheets.length;
    const sheet = archiveSheets[archiveIndex];
    archiveViewer.classList.toggle('is-image-only',sheet.id.startsWith('bird-lingerie-first-'));
    $('#archive-viewer-image').src = sheet.src;
    $('#archive-viewer-image').alt = sheet.caption;
    $('#archive-viewer-title').textContent = sheet.title;
    $('#archive-viewer-caption').textContent = sheet.caption;
    $('#archive-viewer-kind').textContent = sheet.kind;
    $('#archive-position').textContent = `${String(archiveIndex + 1).padStart(2,'0')} / ${archiveSheets.length}`;
    $('.archive-stage').classList.toggle('is-sideways',sheet.orientation === 'sideways' || sheet.orientation === 'clockwise');
    $('.archive-stage').classList.toggle('is-clockwise',sheet.orientation === 'clockwise');
    $('.archive-stage').classList.toggle('is-pencil',sheet.id.startsWith('study-'));
    $('.archive-stage').classList.toggle('is-studio',sheet.id.startsWith('bird-lingerie-first-'));
  };
  $$('[data-archive]').forEach(trigger => trigger.addEventListener('click',() => {
    const index = archiveSheets.findIndex(sheet => sheet.id === trigger.dataset.archive);
    if(index < 0) return;
    archiveTrigger = trigger;
    showArchiveSheet(index);
    closeMenu();
    archiveViewer.showModal();
    archiveViewer.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    $('.archive-close').focus();
  }));
  $('#archive-previous').addEventListener('click',() => showArchiveSheet(archiveIndex-1));
  $('#archive-next').addEventListener('click',() => showArchiveSheet(archiveIndex+1));
  $('.archive-close').addEventListener('click',() => archiveViewer.close());
  archiveViewer.addEventListener('keydown',event => {
    if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showArchiveSheet(archiveIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  archiveViewer.addEventListener('click',event => {
    if(event.target !== archiveViewer) return;
    const bounds = archiveViewer.getBoundingClientRect();
    if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) archiveViewer.close();
  });
  archiveViewer.addEventListener('close',() => {
    if(!dialog.open) document.body.style.overflow = '';
    if(archiveTrigger) archiveTrigger.focus({preventScroll:true});
  });

})();
