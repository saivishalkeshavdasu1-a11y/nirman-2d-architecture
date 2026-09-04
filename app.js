const $ = (id) => document.getElementById(id);
const form = $("planForm");
const notes = {
  courtyard: "The central courtyard creates a cool, shaded heart for everyday living.",
  linear: "A clear east-to-west spine keeps circulation simple and makes every room easy to find.",
  compact: "A compact footprint reduces wasted corridor space while keeping the home bright and connected."
};
const steps = [...form.querySelectorAll("fieldset")];
const progressSteps = [...document.querySelectorAll(".progress-step")];
const progressLines = [...document.querySelectorAll(".progress-line")];
const backButton = $("backButton");
const nextButton = $("nextButton");
const wizardActions = document.querySelector(".wizard-actions");
const workspace = document.querySelector(".workspace");
let currentStep = 0;
const stepRoutes = ["plot", "needs", "style"];

function showStep(index, updateUrl = true) {
  currentStep = index;
  steps.forEach((step, stepIndex) => step.classList.toggle("wizard-step-hidden", stepIndex !== index));
  progressSteps.forEach((step, stepIndex) => {
    step.classList.toggle("active", stepIndex === index);
    step.classList.toggle("done", stepIndex < index);
  });
  progressLines.forEach((line, lineIndex) => line.style.borderColor = lineIndex < index ? "#ff4f93" : "#e5e3e8");
  backButton.style.display = index === 0 ? "none" : "block";
  nextButton.style.display = index === steps.length - 1 ? "none" : "block";
  wizardActions.classList.toggle("final", index === steps.length - 1);
  workspace.classList.remove("results-visible");
  if (updateUrl) history.pushState({ step: index }, "", `?step=${stepRoutes[index]}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function stepFromUrl() {
  const route = new URLSearchParams(window.location.search).get("step");
  const index = stepRoutes.indexOf(route);
  return index === -1 ? 0 : index;
}

function room(x, y, w, h, label, fill, sub = "") {
  const textY = sub ? y + h / 2 - 5 : y + h / 2 + 4;
  return `<g class="room"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" /><text x="${x + w / 2}" y="${textY}" text-anchor="middle">${label}</text>${sub ? `<text class="sub" x="${x + w / 2}" y="${textY + 14}" text-anchor="middle">${sub}</text>` : ""}</g>`;
}

function makeShapePlan(shape, { bedrooms, bathrooms, kitchens, halls, balconies }) {
  const hall = halls > 1 ? `HALL × ${halls}` : "HALL";
  const kitchen = kitchens > 1 ? `KITCHEN × ${kitchens}` : "KITCHEN";
  const balcony = balconies > 1 ? `BALCONY × ${balconies}` : "BALCONY";
  const bed3 = bedrooms > 2 ? "BEDROOM 03" : "UTILITY";
  const bath1 = bathrooms > 1 ? "BATH 01" : "BATH";
  const bath2 = bathrooms > 1 ? "BATH 02" : "UTILITY";
  if (shape === "l") return [
    room(40, 50, 215, 125, hall, "#f5d48a", "14' × 12'"), room(255, 50, 210, 125, "DINING", "#f5d48a", "10' × 12'"), room(465, 50, 215, 125, kitchen, "#f5d48a", "10' × 10'"),
    room(40, 175, 190, 150, "BEDROOM 01", "#f47d67", "11' × 12'"), room(230, 175, 145, 150, "BATH", "#bdb2ed", "5' × 8'"), room(375, 175, 160, 150, "BEDROOM 02", "#f47d67", "10' × 11'"),
    room(40, 325, 190, 145, bed3, "#f47d67", "10' × 10'"), room(230, 325, 145, 145, "BATH", "#bdb2ed", "5' × 8'"), room(375, 325, 160, 145, balcony, "#d5ec45")
  ].join("");
  if (shape === "t") return [
    room(40, 50, 160, 110, hall, "#f5d48a", "14' × 12'"), room(200, 50, 160, 110, "DINING", "#f5d48a", "10' × 12'"), room(360, 50, 160, 110, kitchen, "#f5d48a", "10' × 10'"), room(520, 50, 160, 110, balcony, "#d5ec45"),
    room(220, 197, 145, 155, "BEDROOM 01", "#f47d67", "11' × 12'"), room(365, 197, 135, 155, "COURTYARD", "#78cbd3", "OPEN TO SKY"), room(500, 197, 180, 155, "BEDROOM 02", "#f47d67", "10' × 11'"),
    room(220, 352, 145, 150, bed3, "#f47d67"), room(365, 352, 135, 150, "BATH", "#bdb2ed", "5' × 8'"), room(500, 352, 180, 150, "BATH + UTILITY", "#bdb2ed")
  ].join("");
  if (shape === "u") return [
    room(40, 50, 150, 145, hall, "#f5d48a", "14' × 12'"), room(190, 50, 155, 145, "DINING", "#f5d48a", "10' × 12'"), room(345, 50, 150, 145, kitchen, "#f5d48a", "10' × 10'"), room(495, 50, 185, 145, balcony, "#d5ec45"),
    room(40, 195, 150, 155, "BEDROOM 01", "#f47d67", "11' × 12'"), room(495, 195, 185, 155, "BEDROOM 02", "#f47d67", "10' × 11'"),     room(40, 350, 150, 150, bed3, "#f47d67"), room(495, 350, 92, 150, bath1, "#bdb2ed", "5' × 8'"), room(588, 350, 92, 150, bath2, "#bdb2ed", "5' × 8'"), room(190, 195, 305, 305, "COURTYARD", "#78cbd3", "OPEN TO SKY")
  ].join("");
  if (shape === "trapezoid") return [
    room(105, 60, 185, 120, hall, "#f5d48a", "14' × 12'"), room(290, 60, 170, 120, "DINING", "#f5d48a", "10' × 12'"), room(460, 60, 155, 120, kitchen, "#f5d48a", "10' × 10'"),
    room(75, 180, 180, 150, "BEDROOM 01", "#f47d67", "11' × 12'"), room(255, 180, 130, 150, "BATH", "#bdb2ed", "5' × 8'"), room(385, 180, 175, 150, "COURTYARD", "#78cbd3", "OPEN TO SKY"), room(560, 180, 85, 150, "BEDROOM 02", "#f47d67", "10' × 11'"),
    room(75, 330, 190, 145, bed3, "#f47d67"), room(265, 330, 140, 145, "BATH", "#bdb2ed", "5' × 8'"), room(405, 330, 210, 145, balcony, "#d5ec45")
  ].join("");
  return "";
}

function makePlan({ width, depth, floorHeight, storeys, houseType, plotShape, bedrooms, bathrooms, kitchens, halls, balconies, parking, garden, style }) {
  const houseW = 720;
  const houseH = garden ? 540 : 600;
  let content = "";
  if (style === "linear") {
    content += room(40, 50, 195, 190, halls > 1 ? `HALL × ${halls}` : "HALL", "#f5d48a", "14' × 16'");
    content += room(235, 50, 190, 190, "DINING", "#f5d48a", "10' × 12'");
    content += room(425, 50, 255, 190, kitchens > 1 ? `KITCHEN × ${kitchens}` : "KITCHEN", "#f5d48a", "10' × 10'");
    content += room(40, 240, 220, 160, "BEDROOM 01", "#f47d67", "11' × 12'");
    content += room(260, 240, 220, 160, "BEDROOM 02", "#f47d67", "11' × 12'");
    content += room(480, 240, 200, 160, "BATH + UTILITY", "#bdb2ed", "8' × 10'");
    content += room(40, 400, 205, 100, "ENTRY", "#78cbd3");
    if (bedrooms > 2) content += room(245, 400, 215, 100, "BEDROOM 03", "#f47d67", "10' × 11'");
    content += room(bedrooms > 2 ? 460 : 245, 400, bedrooms > 2 ? 220 : 435, 100, balconies > 1 ? `BALCONY × ${balconies}` : "BALCONY", "#d5ec45");
  } else if (style === "compact") {
    content += room(40, 50, 220, 190, halls > 1 ? `HALL × ${halls}` : "HALL", "#f5d48a", "12' × 14'");
    content += room(260, 50, 200, 190, "DINING", "#f5d48a", "9' × 10'");
    content += room(460, 50, 220, 190, kitchens > 1 ? `KITCHEN × ${kitchens}` : "KITCHEN", "#f5d48a", "9' × 10'");
    content += room(40, 240, 210, 160, "BEDROOM 01", "#f47d67", "10' × 11'");
    content += room(250, 240, 210, 160, "BEDROOM 02", "#f47d67", "10' × 11'");
    content += room(460, 240, 110, 160, "BATH", "#bdb2ed", "5' × 8'");
    content += room(570, 240, 110, 160, "STAIR", "#bdb2ed");
    content += room(40, 400, 200, 100, "BEDROOM 03", "#f47d67", "9' × 10'");
    content += room(240, 400, 220, 100, "BATH + UTILITY", "#bdb2ed");
    content += room(460, 400, 220, 100, balconies > 1 ? `BALCONY × ${balconies}` : "BALCONY", "#d5ec45");
  } else {
    content += room(40, 50, 240, 180, halls > 1 ? `HALL × ${halls}` : "HALL", "#f5d48a", "14' × 16'");
    content += room(280, 50, 180, 180, "DINING", "#f5d48a", "10' × 12'");
    content += room(460, 50, 220, 180, kitchens > 1 ? `KITCHEN × ${kitchens}` : "KITCHEN", "#f5d48a", "10' × 10'");
    content += room(40, 230, 190, 170, "BEDROOM 01", "#f47d67", "11' × 12'");
    content += room(230, 230, 110, 170, "BATH", "#bdb2ed", "5' × 8'");
    content += room(340, 230, 180, 170, "COURTYARD", "#78cbd3", "OPEN TO SKY");
    content += room(520, 230, 160, 170, "BEDROOM 02", "#f47d67", "10' × 11'");
    content += room(40, 400, 200, 100, bedrooms > 2 ? "BEDROOM 03" : "UTILITY", "#f47d67", bedrooms > 2 ? "10' × 10'" : "");
    content += room(240, 400, 180, 100, "BATH", "#bdb2ed", "5' × 8'");
    content += room(420, 400, 260, 100, "BALCONY", "#d5ec45", balconies > 1 ? `${balconies} balconies planned` : "");
  }
  const shapeContent = makeShapePlan(plotShape, { bedrooms, bathrooms, kitchens, halls, balconies });
  if (shapeContent) content = shapeContent;

  if (!parking) content = content.replace(/<text x="360" y="565"[^>]*>CAR PARKING<\/text>/, "");
  const parkingBlock = parking ? `<rect x="40" y="515" width="190" height="55" fill="#dce8e4"/><text class="parking" x="135" y="548" text-anchor="middle">CAR PARKING</text>` : "";
  const gardenBlock = garden ? `<rect x="240" y="515" width="440" height="55" fill="#e8f0c1"/><text class="garden" x="460" y="548" text-anchor="middle">FRONT GARDEN  ·  SOUTH</text>` : "";
  const plotBoundaries = {
    rectangle: '<rect class="outer" x="37" y="47" width="646" height="526" rx="1"/>',
    l: '<path class="outer" d="M37 47h646v230H500v296H37z"/>',
    t: '<path class="outer" d="M37 47h646v150H500v376H220V197H37z"/>',
    u: '<path class="outer" d="M37 47h150v380h306V47h190v526H37z"/>',
    trapezoid: '<path class="outer" d="M92 47h536l55 526H37z"/>'
  };
  const plotClipPaths = {
    rectangle: '<rect x="37" y="47" width="646" height="526" rx="1"/>',
    l: '<path d="M37 47h646v230H500v296H37z"/>',
    t: '<path d="M37 47h646v150H500v376H220V197H37z"/>',
    u: '<path d="M37 47h150v380h306V47h190v526H37z"/>',
    trapezoid: '<path d="M92 47h536l55 526H37z"/>'
  };
  const elevation = Array.from({ length: houseType === "multiple" ? storeys : 1 }, (_, index) => {
    const y = 495 - index * 63;
    return `<rect class="elevation-floor" x="735" y="${y}" width="145" height="58" rx="2"/><rect class="window" x="750" y="${y + 17}" width="25" height="20"/><rect class="window" x="840" y="${y + 17}" width="25" height="20"/>`;
  }).join("");
  const elevationHeight = houseType === "multiple" ? 63 * storeys : 63;
  const roofY = 495 - elevationHeight;
  return `<svg viewBox="0 0 920 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Generated floor plan and house elevation"><style>
  svg{font-family:Manrope,Arial,sans-serif}.room rect{stroke:#142c2a;stroke-width:3}.room text{fill:#142c2a;font-size:13px;font-weight:800;letter-spacing:1.5px}.room text.sub{font-family:'DM Mono',monospace;font-size:9px;font-weight:500;letter-spacing:0}.parking,.garden{font-family:'DM Mono',monospace;fill:#557069;font-size:9px;letter-spacing:1px;font-weight:500}.outer{fill:none;stroke:#142c2a;stroke-width:7}.north{fill:#142c2a;font:500 10px 'DM Mono';letter-spacing:1px}.northline{stroke:#142c2a;stroke-width:2}.elevation-title{fill:#557069;font:500 9px 'DM Mono';letter-spacing:1px}.elevation-floor{fill:#f5d48a;stroke:#142c2a;stroke-width:3}.window{fill:#78cbd3;stroke:#142c2a;stroke-width:2}.roof{fill:#f47d67;stroke:#142c2a;stroke-width:3}</style><defs><clipPath id="plot-clip">${plotClipPaths[plotShape]}</clipPath></defs><rect width="920" height="620" fill="#fff"/><text class="north" x="680" y="18" text-anchor="end">N</text><line class="northline" x1="676" y1="25" x2="676" y2="40"/><path d="M676 22l-4 7h8z" fill="#142c2a"/><g clip-path="url(#plot-clip)">${content}${parkingBlock}${gardenBlock}</g>${plotBoundaries[plotShape]}<text class="elevation-title" x="807" y="18" text-anchor="middle">HOUSE ELEVATION · ${houseType === "multiple" ? storeys + " STOREYS" : "GROUND FLOOR"}</text><path class="roof" d="M725 ${roofY + 3}L807 ${roofY - 38}L889 ${roofY + 3}Z"/>${elevation}<text class="elevation-title" x="807" y="585" text-anchor="middle">${floorHeight}' FLOOR HEIGHT</text></svg>`;
}

function makeHouse3D({ storeys, houseType, balconies, style, plotShape, garden }) {
  const floors = houseType === "multiple" ? storeys : 1;
  const floorMarkup = Array.from({ length: floors }, (_, index) => {
    const y = 270 - index * 58;
    const balconyMarkup = balconies ? `<path class="balcony" d="M${305 + index * 2} ${y + 34}h92v18h-92z"/><path class="rail" d="M310 ${y + 34}v-13m18 13v-13m18 13v-13m18 13v-13m18 13v-13"/>` : "";
    return `<path class="wall-front" d="M165 ${y}l150 38v55l-150-38z"/><path class="wall-side" d="M315 ${y + 38}l130-48v55l-130 48z"/><path class="window3d" d="M205 ${y + 15}l35 9v25l-35-9zM260 ${y + 29}l35 9v25l-35-9z"/><path class="window3d side" d="M350 ${y + 27}l30-11v25l-30 11zM395 ${y + 10}l30-11v25l-30 11z"/>${balconyMarkup}`;
  }).join("");
  const roofY = 270 - floors * 58;
  const roof = style === "compact" ? `<path class="roof3d" d="M150 ${roofY + 6}l165 42 145-54-165-42z"/>` : `<path class="roof3d" d="M150 ${roofY + 6}l165 42 145-54-165-42z"/><path class="roof-edge" d="M315 ${roofY + 48}v18l145-54v-18z"/>`;
  return `<svg viewBox="0 0 620 390" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="3D ${houseType === "multiple" ? storeys + "-storey" : "single-storey"} house concept"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dff3ef"/><stop offset="1" stop-color="#fff8e8"/></linearGradient></defs><rect width="620" height="390" fill="url(#sky)"/><path class="ground" d="M0 325l280-78 340 62-280 81z"/>${garden ? '<circle class="tree" cx="85" cy="265" r="27"/><path class="trunk" d="M82 289v38"/>' : ""}${roof}${floorMarkup}<path class="door3d" d="M175 270l42 11v55l-42-11z"/><path class="path3d" d="M196 325l55 18-38 14-54-17z"/><text class="house-caption" x="310" y="370" text-anchor="middle">${plotShape.toUpperCase()} PLOT · ${floors} ${floors === 1 ? "LEVEL" : "LEVELS"}</text></svg>`;
}

function render() {
  const width = Number($("plotWidth").value) || 40;
  const depth = Number($("plotDepth").value) || 60;
  const floorHeight = Number($("floorHeight").value) || 10;
  const storeys = Number($("storeys").value) || 1;
  const houseType = document.querySelector('input[name="houseType"]:checked').value;
  const plotShape = $("plotShape").value;
  const plotShapeName = { rectangle: "rectangle", l: "L-shaped", t: "T-shaped", u: "U-shaped", trapezoid: "trapezoid" }[plotShape];
  const bedrooms = Number($("bedrooms").value);
  const bathrooms = Number($("bathrooms").value);
  const kitchens = Number($("kitchens").value);
  const halls = Number($("halls").value);
  const balconies = Number($("balconies").value);
  const style = document.querySelector('input[name="style"]:checked').value;
  const parking = $("parking").checked;
  const garden = $("garden").checked;
  const styleName = style[0].toUpperCase() + style.slice(1);
  $("planTitle").innerHTML = `${styleName} ${houseType === "multiple" ? "Multi-storey" : "House"} <span>·</span> ${bedrooms}BHK`;
  $("planStage").innerHTML = makePlan({ width, depth, floorHeight, storeys, houseType, plotShape, bedrooms, bathrooms, kitchens, halls, balconies, parking, garden, style });
  $("houseStage").innerHTML = makeHouse3D({ storeys, houseType, balconies, style, plotShape, garden });
  $("houseDimensions").textContent = `${width}' × ${depth}'`;
  $("houseStoreys").textContent = houseType === "multiple" ? `${storeys} storeys · ${floorHeight}' floor height` : `Single storey · ${floorHeight}' floor height`;
  $("plotLabel").textContent = `${width}' × ${depth}' ${plotShapeName}`;
  $("floorLabel").textContent = houseType === "multiple" ? `All ${storeys} floors + elevation` : "Ground floor + elevation";
  $("areaMetric").textContent = (Math.round(width * depth * (garden ? .7 : .78) * (houseType === "multiple" ? storeys : 1) / 10) * 10).toLocaleString();
  $("openMetric").textContent = style === "courtyard" ? "38%" : style === "linear" ? "24%" : "19%";
  $("roomsMetric").textContent = String(bedrooms + bathrooms + kitchens + halls + balconies + 1).padStart(2, "0");
  $("designNote").textContent = `${notes[style]} The plan includes ${halls} hall, ${kitchens} kitchen and ${balconies} balcony${balconies === 1 ? "" : "s"}. The ${plotShapeName} plot is arranged for a ${houseType === "multiple" ? storeys + "-storey" : "single-storey"} home.`;
}

document.querySelectorAll(".stepper button").forEach((button) => button.addEventListener("click", () => {
  const input = $(button.dataset.target);
  input.value = Math.min(input.id === "bedrooms" ? 4 : 4, Math.max(1, Number(input.value) + Number(button.dataset.step)));
  $(`${input.id}Value`).textContent = input.value;
}));
document.querySelectorAll(".style-card input").forEach((input) => input.addEventListener("change", () => {
  document.querySelectorAll(".style-card").forEach((card) => card.classList.toggle("selected", card.querySelector("input").checked));
}));
progressSteps.forEach((step, index) => step.addEventListener("click", () => showStep(index)));
document.querySelectorAll('input[name="houseType"]').forEach((input) => input.addEventListener("change", () => {
  document.querySelectorAll(".choice-card").forEach((card) => card.classList.toggle("selected", card.querySelector("input").checked));
  $("storeyControl").classList.toggle("control-hidden", input.value !== "multiple");
}));
form.addEventListener("submit", (event) => { event.preventDefault(); render(); workspace.classList.add("results-visible"); workspace.scrollIntoView({ behavior: "smooth", block: "start" }); showToast("Your floor plan has been generated"); });
nextButton.addEventListener("click", () => showStep(Math.min(currentStep + 1, steps.length - 1)));
backButton.addEventListener("click", () => showStep(Math.max(currentStep - 1, 0)));
window.addEventListener("popstate", () => showStep(stepFromUrl(), false));
$("resetButton").addEventListener("click", () => { form.reset(); $("bedrooms").value = 2; $("bathrooms").value = 2; $("kitchens").value = 1; $("halls").value = 1; $("balconies").value = 1; $("storeys").value = 2; ["bedrooms", "bathrooms", "kitchens", "halls", "balconies", "storeys"].forEach((id) => $(`${id}Value`).textContent = $(`${id}`).value); document.querySelectorAll(".style-card,.choice-card").forEach((card) => card.classList.toggle("selected", card.querySelector("input").checked)); $("storeyControl").classList.add("control-hidden"); render(); showStep(0); showToast("Plan reset to the starter brief"); });
$("downloadButton").addEventListener("click", () => { const blob = new Blob([$("planStage").innerHTML], { type: "image/svg+xml" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "nirman-floor-plan.svg"; link.click(); URL.revokeObjectURL(link.href); showToast("SVG exported"); });
$("shareButton").addEventListener("click", async () => { const summary = `${$("planTitle").textContent.trim()} — ${$("plotLabel").textContent} plot`; try { await navigator.clipboard.writeText(summary); showToast("Plan summary copied"); } catch { showToast(summary); } });
let toastTimer;
function showToast(message) { const toast = $("toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2200); }
render();
showStep(stepFromUrl(), false);
