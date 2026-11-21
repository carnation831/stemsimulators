/* Predicting products practice.
   Products only: coefficients are ignored. Product order does not matter.
   Plain digits and subscript digits are the same. Element capitals are accepted
   either way; the answer key shows the proper capitals.

   Water convention on this page:
   - Neutralization, peroxide, and acid reactions in water: H2O(l) only.
   - Complete combustion and H2 + O2: preferred H2O(l), H2O(g) also accepted.
   - Heated hydrates: preferred H2O(g), H2O(l) also accepted.
   - Heated NaHCO3 and (NH4)2CO3: preferred H2O(l), to match the 5 types
     practice, and H2O(g) is also accepted.
   Bromine and iodine made in water: preferred Br2(l) and I2(s), and (aq)
   is also accepted.
*/
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof root !== "undefined") root.PredictProducts = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var SUB = "₀₁₂₃₄₅₆₇₈₉";

  function P(formula, state, acceptStates) {
    var product = { formula: formula, state: state };
    if (acceptStates) product.acceptStates = acceptStates;
    return product;
  }

  var H2O_L = P("H2O", "l", ["l", "g"]);
  var H2O_G = P("H2O", "g", ["g", "l"]);
  var H2O_LIQUID = P("H2O", "l");
  var BR2 = P("Br2", "l", ["l", "aq"]);
  var I2 = P("I2", "s", ["s", "aq"]);

function item(pattern, reactants, products, explanation, extras) {
  var question = {
    pattern: pattern,
    reactants: reactants,
    products: products,
    nr: false,
    explanation: explanation
  };
  if (extras) {
    Object.keys(extras).forEach(function (key) {
      question[key] = extras[key];
    });
  }
  return question;
}

  function noReaction(reactants, explanation) {
    return {
      pattern: "No reaction",
      reactants: reactants,
      products: [],
      nr: true,
      explanation: explanation
    };
  }

  var SETS = [
    {
      id: "synthesis",
      name: "Synthesis",
      fileSlug: "synthesis",
      blurb: "Two reactants combine into one product. Metals, nonmetals, and oxides.",
      questions: [
        item("Synthesis", "Na(s) + Cl2(g)", [P("NaCl", "s")],
          "Synthesis. Sodium metal and chlorine gas combine into one salt. Sodium chloride is a solid, NaCl(s). Chlorine is diatomic, but the product has one Cl."),
        item("Synthesis", "Mg(s) + O2(g)", [P("MgO", "s")],
          "Synthesis. Magnesium burns in oxygen to make magnesium oxide. The ionic oxide is a solid, MgO(s)."),
        item("Synthesis", "Fe(s) + O2(g)", [P("Fe2O3", "s")],
          "Synthesis. Iron and oxygen form iron(III) oxide, Fe2O3(s). This course uses Fe2O3, the red-brown iron oxide, not FeO."),
        item("Synthesis", "K(s) + Br2(l)", [P("KBr", "s")],
          "Synthesis. Potassium metal and liquid bromine combine into the salt potassium bromide, KBr(s)."),
        item("Synthesis", "Zn(s) + S(s)", [P("ZnS", "s")],
          "Synthesis. Zinc metal and solid sulfur combine into zinc sulfide, ZnS(s)."),
        item("Synthesis", "Al(s) + Cl2(g)", [P("AlCl3", "s")],
          "Synthesis. Aluminum is a +3 ion, so the salt is AlCl3. With no water in the reaction, aluminum chloride is a solid, AlCl3(s)."),
        item("Synthesis", "SO3(g) + H2O(l)", [P("H2SO4", "aq")],
          "Synthesis. A nonmetal oxide plus water makes an acid. Sulfur trioxide and water make sulfuric acid dissolved in water, H2SO4(aq)."),
        item("Synthesis", "Na2O(s) + H2O(l)", [P("NaOH", "aq")],
          "Synthesis. A Group 1 metal oxide plus water makes a hydroxide. Sodium hydroxide dissolves, so it is NaOH(aq)."),
        item("Synthesis", "CaO(s) + CO2(g)", [P("CaCO3", "s")],
          "Synthesis. A metal oxide and carbon dioxide combine into a carbonate. Calcium carbonate is a solid, CaCO3(s)."),
        item("Synthesis", "H2(g) + O2(g)", [H2O_L],
          "Synthesis. Hydrogen and oxygen combine into one product, water. At room temperature write H2O(l). H2O(g) is also accepted."),
        item("Synthesis", "P4O10(s) + H2O(l)", [P("H3PO4", "aq")],
          "Synthesis. Tetraphosphorus decoxide plus water makes phosphoric acid. The acid is dissolved, so write H3PO4(aq)."),
        item("Synthesis", "Cu(s) + O2(g)", [P("CuO", "s")],
          "Synthesis. Copper and oxygen form copper(II) oxide. This course writes the black solid CuO(s).")
      ]
    },
    {
      id: "decomposition",
      name: "Decomposition",
      fileSlug: "decomposition",
      blurb: "One compound breaks apart: binary compounds, carbonates, chlorates, and hydrates.",
      questions: [
        item("Decomposition", "HgO(s)", [P("Hg", "l"), P("O2", "g")],
          "Decomposition. Mercury(II) oxide breaks into its elements. Mercury metal is a liquid, Hg(l), and oxygen is the diatomic gas O2(g)."),
        item("Decomposition", "H2O(l)", [P("H2", "g"), P("O2", "g")],
          "Decomposition. Water can be split into its elements. Both are diatomic gases: H2(g) and O2(g)."),
        item("Decomposition", "H2O2(aq)", [H2O_LIQUID, P("O2", "g")],
          "Decomposition. Hydrogen peroxide breaks into water and oxygen. At room temperature the water is H2O(l) and the oxygen is O2(g)."),
        item("Decomposition", "CaCO3(s)", [P("CaO", "s"), P("CO2", "g")],
          "Decomposition. Heating calcium carbonate makes calcium oxide, CaO(s), and carbon dioxide gas, CO2(g)."),
        item("Decomposition", "CuCO3(s)", [P("CuO", "s"), P("CO2", "g")],
          "Decomposition. Copper(II) carbonate breaks into copper(II) oxide, CuO(s), and carbon dioxide gas, CO2(g)."),
        item("Decomposition", "MgCO3(s)", [P("MgO", "s"), P("CO2", "g")],
          "Decomposition. Heating magnesium carbonate makes magnesium oxide, MgO(s), and carbon dioxide gas, CO2(g)."),
        item("Decomposition", "KClO3(s)", [P("KCl", "s"), P("O2", "g")],
          "Decomposition. A chlorate breaks into a chloride and oxygen. Potassium chlorate makes solid KCl(s) and oxygen gas, O2(g)."),
        item("Decomposition", "NaClO3(s)", [P("NaCl", "s"), P("O2", "g")],
          "Decomposition. Sodium chlorate breaks into sodium chloride, NaCl(s), and oxygen gas, O2(g)."),
        item("Decomposition", "CuSO4·5H2O(s)", [P("CuSO4", "s"), H2O_G],
          "Decomposition. Heating the blue hydrate drives off the water and leaves anhydrous copper(II) sulfate, CuSO4(s). Write the released water as H2O(g). H2O(l) is also accepted."),
        item("Decomposition", "MgSO4·7H2O(s)", [P("MgSO4", "s"), H2O_G],
          "Decomposition. Heating Epsom salt drives off the water of hydration. The products are solid MgSO4(s) and water. Prefer H2O(g). H2O(l) is also accepted."),
        item("Decomposition", "NaHCO3(s)", [P("Na2CO3", "s"), H2O_L, P("CO2", "g")],
          "Decomposition. Heating baking soda makes sodium carbonate, Na2CO3(s), water, and carbon dioxide gas, CO2(g). This page writes the water as H2O(l). H2O(g) is also accepted."),
        item("Decomposition", "(NH4)2CO3(s)", [P("NH3", "g"), P("CO2", "g"), H2O_L],
          "Decomposition. Ammonium carbonate breaks into ammonia gas, NH3(g), carbon dioxide gas, CO2(g), and water. Prefer H2O(l). H2O(g) is also accepted.")
      ]
    },
    {
      id: "single",
      name: "Single Replacement",
      fileSlug: "single",
      blurb: "One element takes the place of another. Use the activity series and the usual ion charges.",
      questions: [
        item("Single Replacement", "Zn(s) + CuCl2(aq)", [P("ZnCl2", "aq"), P("Cu", "s")],
          "Single replacement. Zinc is more reactive than copper, so zinc replaces it. Zinc chloride dissolves, ZnCl2(aq), and copper metal is Cu(s)."),
        item("Single Replacement", "Mg(s) + HCl(aq)", [P("MgCl2", "aq"), P("H2", "g")],
          "Single replacement. Magnesium is above hydrogen, so it replaces H in the acid. The products are dissolved magnesium chloride, MgCl2(aq), and hydrogen gas, H2(g)."),
        item("Single Replacement", "Fe(s) + CuSO4(aq)", [P("FeSO4", "aq"), P("Cu", "s")],
          "Single replacement. Iron is more reactive than copper and forms the Fe2+ ion here, not Fe3+. The products are FeSO4(aq) and copper metal, Cu(s)."),
        item("Single Replacement", "Cu(s) + AgNO3(aq)", [P("Cu(NO3)2", "aq"), P("Ag", "s")],
          "Single replacement. Copper replaces silver. Copper(II) nitrate is soluble, Cu(NO3)2(aq), and silver metal is Ag(s)."),
        item("Single Replacement", "Al(s) + CuCl2(aq)", [P("AlCl3", "aq"), P("Cu", "s")],
          "Single replacement. Aluminum is more reactive than copper. Aluminum is +3, so the dissolved salt is AlCl3(aq), and copper is Cu(s)."),
        item("Single Replacement", "Cl2(g) + KBr(aq)", [P("KCl", "aq"), BR2],
          "Single replacement. Chlorine is more reactive than bromine, so it replaces bromide. Potassium chloride stays dissolved, KCl(aq). Elemental bromine is written Br2(l). Br2(aq) is also accepted."),
        item("Single Replacement", "Br2(l) + NaI(aq)", [P("NaBr", "aq"), I2],
          "Single replacement. Bromine is more reactive than iodine, so it replaces iodide. Sodium bromide is NaBr(aq). Elemental iodine is written I2(s). I2(aq) is also accepted."),
        item("Single Replacement", "Na(s) + H2O(l)", [P("NaOH", "aq"), P("H2", "g")],
          "Single replacement. Sodium metal reacts with water. The products are dissolved sodium hydroxide, NaOH(aq), and hydrogen gas, H2(g)."),
        item("Single Replacement", "Zn(s) + H2SO4(aq)", [P("ZnSO4", "aq"), P("H2", "g")],
          "Single replacement. Zinc is above hydrogen, so it reacts with the acid. Zinc sulfate dissolves, ZnSO4(aq), and hydrogen is H2(g)."),
        item("Single Replacement", "Ca(s) + HCl(aq)", [P("CaCl2", "aq"), P("H2", "g")],
          "Single replacement. Calcium is above hydrogen and forms a +2 ion. The products are dissolved CaCl2(aq) and hydrogen gas, H2(g)."),
        item("Single Replacement", "Mg(s) + AgNO3(aq)", [P("Mg(NO3)2", "aq"), P("Ag", "s")],
          "Single replacement. Magnesium replaces silver. All nitrates dissolve, so Mg(NO3)2(aq), and the silver that forms is Ag(s)."),
        item("Single Replacement", "Al(s) + HCl(aq)", [P("AlCl3", "aq"), P("H2", "g")],
          "Single replacement. Aluminum is above hydrogen. Aluminum is +3, so the salt is AlCl3(aq), and hydrogen gas is H2(g).")
      ]
    },
    {
      id: "double",
      name: "Double Replacement",
      fileSlug: "double",
      blurb: "Two compounds swap partners. Watch for a precipitate, water, or a gas.",
      questions: [
        item("Double Replacement", "AgNO3(aq) + NaCl(aq)", [P("AgCl", "s"), P("NaNO3", "aq")],
          "Double replacement. Silver and sodium swap partners. Silver chloride is an insoluble precipitate, AgCl(s). Sodium nitrate stays dissolved, NaNO3(aq)."),
        item("Double Replacement", "BaCl2(aq) + Na2SO4(aq)", [P("BaSO4", "s"), P("NaCl", "aq")],
          "Double replacement. Barium sulfate is an insoluble sulfate, so it precipitates as BaSO4(s). Sodium chloride stays dissolved, NaCl(aq)."),
        item("Double Replacement", "Pb(NO3)2(aq) + KI(aq)", [P("PbI2", "s"), P("KNO3", "aq")],
          "Double replacement. Lead(II) iodide is insoluble, so it is the yellow solid PbI2(s). Potassium nitrate stays dissolved, KNO3(aq)."),
        item("Double Replacement", "HCl(aq) + NaOH(aq)", [P("NaCl", "aq"), H2O_LIQUID],
          "Double replacement, a neutralization. An acid and a hydroxide make a salt and water. The products are dissolved NaCl(aq) and liquid water, H2O(l)."),
        item("Double Replacement", "H2SO4(aq) + KOH(aq)", [P("K2SO4", "aq"), H2O_LIQUID],
          "Double replacement, a neutralization. Sulfuric acid and potassium hydroxide make potassium sulfate and water. K2SO4(aq) is soluble, and the water is H2O(l)."),
        item("Double Replacement", "Na2CO3(aq) + HCl(aq)", [P("NaCl", "aq"), H2O_LIQUID, P("CO2", "g")],
          "Double replacement. An acid on a carbonate makes a salt, water, and carbon dioxide gas. The products are NaCl(aq), H2O(l), and CO2(g)."),
        item("Double Replacement", "CaCO3(s) + HCl(aq)", [P("CaCl2", "aq"), H2O_LIQUID, P("CO2", "g")],
          "Double replacement. Acid reacts with calcium carbonate and releases carbon dioxide. The products are dissolved CaCl2(aq), H2O(l), and CO2(g)."),
        item("Double Replacement", "FeCl3(aq) + NaOH(aq)", [P("Fe(OH)3", "s"), P("NaCl", "aq")],
          "Double replacement. The reactant FeCl3 tells you the ion is Fe3+, so the hydroxide is Fe(OH)3. That hydroxide is insoluble, Fe(OH)3(s). Sodium chloride stays NaCl(aq)."),
        item("Double Replacement", "CuSO4(aq) + NaOH(aq)", [P("Cu(OH)2", "s"), P("Na2SO4", "aq")],
          "Double replacement. Copper(II) hydroxide is an insoluble blue solid, Cu(OH)2(s). Sodium sulfate stays dissolved, Na2SO4(aq)."),
        item("Double Replacement", "MgCl2(aq) + Na2CO3(aq)", [P("MgCO3", "s"), P("NaCl", "aq")],
          "Double replacement. Magnesium carbonate is an insoluble carbonate, MgCO3(s). Sodium chloride stays dissolved, NaCl(aq)."),
        item("Double Replacement", "NH4Cl(aq) + AgNO3(aq)", [P("AgCl", "s"), P("NH4NO3", "aq")],
          "Double replacement. Silver chloride precipitates, AgCl(s). Ammonium nitrate is soluble, NH4NO3(aq)."),
        item("Double Replacement", "HNO3(aq) + KOH(aq)", [P("KNO3", "aq"), H2O_LIQUID],
          "Double replacement, a neutralization. Nitric acid and potassium hydroxide make dissolved potassium nitrate, KNO3(aq), and liquid water, H2O(l).")
      ]
    },
    {
      id: "combustion",
      name: "Combustion",
      fileSlug: "combustion",
      blurb: "Complete combustion. A fuel plus oxygen makes carbon dioxide and water.",
      questions: [
        item("Combustion", "CH4(g) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of methane makes carbon dioxide gas and water. Write CO2(g) and H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C2H6(g) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of ethane makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C3H8(g) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of propane makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C4H10(g) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of butane makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C2H4(g) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of ethene makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C2H2(g) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of ethyne makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C5H12(l) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of liquid pentane makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C6H6(l) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of liquid benzene makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C8H18(l) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of liquid octane makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "CH3OH(l) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of liquid methanol still makes only CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C2H5OH(l) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of liquid ethanol makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C3H7OH(l) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of liquid propanol makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted.")
      ]
    },
    {
      id: "mixed-1",
      name: "Mixed Practice Level 1",
      fileSlug: "mixed-1",
      levelLabel: "Level 1",
      blurb: "Easier mix of all five types. Straightforward formulas, and every reaction happens.",
      questions: [
        item("Synthesis", "Ca(s) + Cl2(g)", [P("CaCl2", "s")],
          "Synthesis. Calcium metal and chlorine gas combine into one salt. Calcium chloride is a solid, CaCl2(s)."),
        item("Synthesis", "K2O(s) + H2O(l)", [P("KOH", "aq")],
          "Synthesis. Potassium oxide plus water makes potassium hydroxide. Group 1 hydroxides dissolve, so write KOH(aq)."),
        item("Decomposition", "BaCO3(s)", [P("BaO", "s"), P("CO2", "g")],
          "Decomposition. Heating barium carbonate makes barium oxide, BaO(s), and carbon dioxide gas, CO2(g)."),
        item("Decomposition", "Ag2O(s)", [P("Ag", "s"), P("O2", "g")],
          "Decomposition. Silver oxide breaks into its elements. Silver metal is Ag(s), and oxygen is the diatomic gas O2(g)."),
        item("Single Replacement", "Zn(s) + HCl(aq)", [P("ZnCl2", "aq"), P("H2", "g")],
          "Single replacement. Zinc is above hydrogen, so it reacts with the acid. The products are dissolved ZnCl2(aq) and hydrogen gas, H2(g)."),
        item("Single Replacement", "Cl2(g) + NaBr(aq)", [P("NaCl", "aq"), BR2],
          "Single replacement. Chlorine replaces bromine. Sodium chloride stays dissolved, NaCl(aq). Write elemental bromine as Br2(l). Br2(aq) is also accepted."),
        item("Single Replacement", "Mg(s) + CuSO4(aq)", [P("MgSO4", "aq"), P("Cu", "s")],
          "Single replacement. Magnesium is more reactive than copper. Magnesium sulfate dissolves, MgSO4(aq), and copper metal is Cu(s)."),
        item("Double Replacement", "AgNO3(aq) + KCl(aq)", [P("AgCl", "s"), P("KNO3", "aq")],
          "Double replacement. Silver chloride is insoluble, AgCl(s). Potassium nitrate stays dissolved, KNO3(aq)."),
        item("Double Replacement", "HCl(aq) + KOH(aq)", [P("KCl", "aq"), H2O_LIQUID],
          "Double replacement, a neutralization. Hydrochloric acid and potassium hydroxide make dissolved KCl(aq) and liquid water, H2O(l)."),
        item("Double Replacement", "Pb(NO3)2(aq) + NaCl(aq)", [P("PbCl2", "s"), P("NaNO3", "aq")],
          "Double replacement. Using the cold-water solubility rules, lead(II) chloride is insoluble, PbCl2(s). Sodium nitrate stays dissolved, NaNO3(aq)."),
        item("Combustion", "C7H16(l) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of liquid heptane makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted."),
        item("Combustion", "C6H14(l) + O2(g)", [P("CO2", "g"), H2O_L],
          "Combustion. Complete combustion of liquid hexane makes CO2(g) and water. Prefer H2O(l). H2O(g) is also accepted.")
      ]
    },
    {
      id: "mixed-2",
      name: "Mixed Practice Level 2",
      fileSlug: "mixed-2",
      levelLabel: "Level 2",
      allowsNR: true,
      blurb: "Harder mix: polyatomic ions, transition-metal charges, gases, and some no-reaction cases.",
      questions: [
        item("Synthesis", "Fe(s) + Cl2(g)", [P("FeCl3", "s")],
          "Synthesis. Chlorine oxidizes iron to Fe3+, so the product is iron(III) chloride, not FeCl2. With no water present, write FeCl3(s)."),
        item("Single Replacement", "Sn(s) + HCl(aq)", [P("SnCl2", "aq"), P("H2", "g")],
          "Single replacement. Tin is above hydrogen. With hydrochloric acid, tin forms the Sn2+ ion, so the salt is SnCl2(aq). Hydrogen is H2(g)."),
        item("Single Replacement", "Fe(s) + AgNO3(aq)", [P("Fe(NO3)2", "aq"), P("Ag", "s")],
          "Single replacement. Iron replaces silver and stops at Fe2+ in this reaction. All nitrates dissolve, so Fe(NO3)2(aq), and silver metal is Ag(s)."),
        item("Single Replacement", "Al(s) + Fe2(SO4)3(aq)", [P("Al2(SO4)3", "aq"), P("Fe", "s")],
          "Single replacement. Aluminum is more reactive than iron. Aluminum is +3 and sulfate is -2, so the dissolved salt is Al2(SO4)3(aq). Iron metal is Fe(s)."),
        noReaction("Cu(s) + ZnSO4(aq)",
          "No reaction. Copper is below zinc on the activity series, so copper cannot replace zinc."),
        noReaction("Br2(l) + KCl(aq)",
          "No reaction. Bromine is less reactive than chlorine, so it cannot replace chloride ions."),
        noReaction("Ag(s) + HCl(aq)",
          "No reaction. Silver is below hydrogen on the activity series, so it does not replace hydrogen in hydrochloric acid."),
        noReaction("Cu(s) + Mg(NO3)2(aq)",
          "No reaction. Copper is below magnesium on the activity series, so copper cannot replace magnesium."),
        noReaction("NaCl(aq) + KNO3(aq)",
          "No reaction. The ions could trade to make NaNO3 and KCl, but both of those salts dissolve. There is no precipitate, gas, or water, so no reaction happens."),
        item("Double Replacement", "Cr(NO3)3(aq) + NaOH(aq)", [P("Cr(OH)3", "s"), P("NaNO3", "aq")],
          "Double replacement. Cr(NO3)3 tells you the ion is Cr3+. Chromium(III) hydroxide is insoluble, Cr(OH)3(s). Sodium nitrate stays dissolved, NaNO3(aq)."),
        item("Double Replacement", "Pb(NO3)2(aq) + Na2SO4(aq)", [P("PbSO4", "s"), P("NaNO3", "aq")],
          "Double replacement. Lead(II) sulfate is an insoluble sulfate, PbSO4(s). Sodium nitrate stays dissolved, NaNO3(aq)."),
        item("Double Replacement", "Na2CO3(aq) + HNO3(aq)", [P("NaNO3", "aq"), H2O_LIQUID, P("CO2", "g")],
          "Double replacement. Acid on a carbonate makes a salt, water, and carbon dioxide. The products are NaNO3(aq), H2O(l), and CO2(g)."),
        item("Double Replacement", "FeS(s) + HCl(aq)", [P("FeCl2", "aq"), P("H2S", "g")],
          "Double replacement. FeS is iron(II) sulfide. Acid on a sulfide releases hydrogen sulfide gas, H2S(g). The salt is dissolved FeCl2(aq)."),
        item("Double Replacement", "NH4Cl(aq) + NaOH(aq)", [P("NaCl", "aq"), P("NH3", "g", ["g", "aq"]), H2O_LIQUID],
          "Double replacement. An ammonium salt plus a hydroxide makes ammonia and water. Prefer NaCl(aq) + NH3(g) + H2O(l). NH3(aq) in place of NH3(g) is also accepted, and so is NaCl(aq) + NH4OH(aq).",
          {
            alternates: [
              [P("NaCl", "aq"), P("NH4OH", "aq")]
            ]
          }),
        item("Decomposition", "Na2CO3·10H2O(s)", [P("Na2CO3", "s"), H2O_G],
          "Decomposition. Heating washing soda drives off the water of hydration only. Group 1 carbonates do not break into the oxide here, so the solid left is Na2CO3(s). Prefer H2O(g). H2O(l) is also accepted.")
      ]
    }
  ];

  function subscriptToDigit(text) {
    return String(text).replace(/[₀₁₂₃₄₅₆₇₈₉]/g, function (ch) {
      return String(SUB.indexOf(ch));
    });
  }

  function formulaKey(raw) {
    var s = subscriptToDigit(raw);
    s = s.replace(/[·•∙⋅]/g, "*");
    s = s.replace(/([A-Za-z0-9)])[xX*](?=\d*[Hh]2[Oo])/g, "$1*");
    s = s.replace(/([A-Za-z0-9)])\.(?=\d*[Hh]2[Oo])/g, "$1*");
    s = s.replace(/\s+/g, "");
    s = s.replace(/([A-Za-z)])(\d+)([Hh]2[Oo])$/g, "$1*$2$3");
    var prev;
    do {
      prev = s;
      s = s.replace(/\(([A-Za-z0-9*]+)\)(?!\d)/g, "$1");
    } while (s !== prev);
    return s;
  }

  function sameFormula(a, b) {
    return formulaKey(a).toLowerCase() === formulaKey(b).toLowerCase();
  }

  function mapState(word) {
    var w = String(word).toLowerCase();
    if (w === "s" || w === "solid") return "s";
    if (w === "l" || w === "liquid") return "l";
    if (w === "g" || w === "gas") return "g";
    if (w === "aq" || w === "aqueous") return "aq";
    return "";
  }

  function isNoReaction(text) {
    var t = String(text).trim().toLowerCase().replace(/[.!]+$/g, "").trim();
    t = t.replace(/\s+/g, " ");
    return /^(?:it is |it's |this is )?(?:a )?no[\s-]*reaction$/.test(t) ||
      /^no[\s-]*rxn$/.test(t) ||
      /^n\s*\.?\s*r\.?$/.test(t) ||
      /^nothing(?: happens)?$/.test(t);
  }

  function parseSpecies(token) {
    var t = subscriptToDigit(token).replace(/\s+/g, "");
    t = t.replace(/^(\d+)(?=[A-Za-z(])/ , "");
    var state = "";
    var match = t.match(/\((solid|liquid|gas|aqueous|aq|s|l|g)\)$/i);
    if (match) {
      state = mapState(match[1]);
      t = t.slice(0, match.index);
    }
    return { formula: formulaKey(t), state: state };
  }

  function splitProducts(text) {
    return String(text).split(/\s*(?:\+|\,|&|;|\band\b)\s*/i).map(function (part) {
      return part.trim();
    }).filter(Boolean);
  }

  function productSide(raw) {
    var text = String(raw == null ? "" : raw).trim();
    var pieces = text.split(/\s*(?:→|->|=>|➔)\s*/);
    if (pieces.length > 1) text = pieces[pieces.length - 1].trim();
    return text;
  }

  function parseAnswer(raw) {
    var text = productSide(raw);
    if (!text) return { empty: true, nr: false, species: [] };
    if (isNoReaction(text)) return { empty: false, nr: true, species: [] };
    var species = splitProducts(text).map(parseSpecies).filter(function (sp) {
      return sp.formula || sp.state;
    });
    return { empty: species.length === 0, nr: false, species: species };
  }

  function allowedStates(product) {
    return product.acceptStates && product.acceptStates.length ? product.acceptStates : [product.state];
  }

  function matchesProducts(species, products) {
    if (!products || species.length !== products.length) return false;
    var used = [];
    for (var i = 0; i < species.length; i++) {
      var found = -1;
      for (var j = 0; j < products.length; j++) {
        if (used[j]) continue;
        if (!species[i].state) continue;
        if (!sameFormula(species[i].formula, products[j].formula)) continue;
        if (allowedStates(products[j]).indexOf(species[i].state) === -1) continue;
        found = j;
        break;
      }
      if (found < 0) return false;
      used[found] = true;
    }
    return true;
  }

  function prettyFormula(plain) {
    return subscriptToDigit(plain).replace(/([A-Za-z)])(\d+)/g, function (_, ch, digits) {
      var out = ch;
      for (var i = 0; i < digits.length; i++) out += SUB[digits[i]];
      return out;
    });
  }

  function formatProduct(product) {
    return prettyFormula(product.formula) + "(" + product.state + ")";
  }

  function formatProductList(products) {
    return products.map(formatProduct).join(" + ");
  }

function gradeAnswer(question, raw) {
    var parsed = parseAnswer(raw);
    var expectedPlain = question.nr ? "no reaction" : formatSample(question.products);
    var result = {
      correct: false,
      empty: parsed.empty,
      nr: parsed.nr,
      expectedPlain: expectedPlain,
      expectedText: question.nr ? "no reaction" : formatProductList(question.products),
      alternates: (question.alternates || []).map(formatSample),
      explanation: question.explanation,
      topic: question.pattern
    };
    if (parsed.empty) return result;
    if (question.nr) {
      result.correct = parsed.nr;
      return result;
    }
    if (parsed.nr) return result;
    if (matchesProducts(parsed.species, question.products)) {
      result.correct = true;
      return result;
    }
    var alts = question.alternates || [];
    for (var i = 0; i < alts.length; i++) {
      if (matchesProducts(parsed.species, alts[i])) {
        result.correct = true;
        return result;
      }
    }
    return result;
  }

  function elementsIn(text) {
    var stripped = String(text).replace(/\((?:s|l|g|aq)\)/gi, "");
    var found = stripped.match(/[A-Z][a-z]?/g) || [];
    var set = {};
    found.forEach(function (el) { set[el] = true; });
    return set;
  }

  function sameElementSet(a, b) {
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (var i = 0; i < aKeys.length; i++) {
      if (!b[aKeys[i]]) return false;
    }
    return true;
  }

  function elementsOfProducts(products) {
    var bag = {};
    products.forEach(function (product) {
      var els = elementsIn(product.formula);
      Object.keys(els).forEach(function (el) { bag[el] = true; });
    });
    return bag;
  }

  function selfCheck() {
    var errors = [];
    var seen = {};
    var counts = {
      synthesis: 12,
      decomposition: 12,
      single: 12,
      double: 12,
      combustion: 12,
      "mixed-1": 12,
      "mixed-2": 15
    };
    SETS.forEach(function (set) {
      if (set.questions.length !== counts[set.id]) {
        errors.push(set.id + " has " + set.questions.length + " questions, expected " + counts[set.id]);
      }
      var nrCount = 0;
      set.questions.forEach(function (q, index) {
        var label = set.id + " Q" + (index + 1) + " (" + q.reactants + ")";
        if (!q.explanation) errors.push(label + " missing explanation");
        if (seen[q.reactants]) errors.push("Duplicate prompt: " + q.reactants);
        seen[q.reactants] = true;
        if (q.nr) {
          nrCount++;
          if (set.id !== "mixed-2") errors.push(label + " is NR outside mixed level 2");
          if (gradeAnswer(q, "no reaction").correct !== true) errors.push(label + " NR phrase failed");
          if (gradeAnswer(q, "NR").correct !== true) errors.push(label + " NR abbreviation failed");
          if (gradeAnswer(q, "Nothing happens!").correct !== true) errors.push(label + " nothing-happens phrase failed");
          if (gradeAnswer(q, "NaCl(aq)").correct !== false) errors.push(label + " should reject a real product");
          return;
        }
        if (set.allowsNR && false) { /* NR questions return above */ }
        q.products.forEach(function (product) {
          if (product.acceptStates && product.acceptStates.indexOf(product.state) === -1) {
            errors.push(label + " preferred state not allowed for " + product.formula);
          }
        });
        var sample = formatSample(q.products);
        if (!gradeAnswer(q, sample).correct) errors.push(label + " rejected its own answer " + sample);
        if (!gradeAnswer(q, "  " + sample.split("+").reverse().join("  +  ") + " ").correct) {
          errors.push(label + " rejected reversed spaced answer");
        }
        var subscripted = sample.replace(/\d/g, function (d) { return SUB[d]; });
        if (!gradeAnswer(q, subscripted).correct) errors.push(label + " rejected subscripts");
        var withCoeff = q.products.map(function (product, i) {
          return (i + 2) + product.formula + "(" + product.state.toUpperCase() + ")";
        }).join("+");
        if (!gradeAnswer(q, withCoeff).correct) errors.push(label + " rejected coefficients " + withCoeff);
        if (gradeAnswer(q, "no reaction").correct) errors.push(label + " should not accept no reaction");
        var wrong = q.products.map(function (product, i) {
          if (i === 0) {
            var bad = ["s", "l", "g", "aq"].filter(function (state) {
              return allowedStates(product).indexOf(state) === -1;
            })[0];
            return product.formula + "(" + bad + ")";
          }
          return product.formula + "(" + product.state + ")";
        }).join(" + ");
        if (gradeAnswer(q, wrong).correct) errors.push(label + " should reject " + wrong);
        if (q.products.length > 1) {
          var dropped = formatSample(q.products.slice(1));
          if (gradeAnswer(q, dropped).correct) errors.push(label + " should reject a missing product");
        }
        var reactantEls = elementsIn(q.reactants);
        var productEls = elementsOfProducts(q.products);
        if (!sameElementSet(reactantEls, productEls)) {
          errors.push(label + " element mismatch reactants [" + Object.keys(reactantEls).join(",") + "] products [" + Object.keys(productEls).join(",") + "]");
        }
        (q.alternates || []).forEach(function (alt, altIndex) {
          if (!gradeAnswer(q, formatSample(alt)).correct) {
            errors.push(label + " alternate " + altIndex + " rejected");
          }
          if (!sameElementSet(reactantEls, elementsOfProducts(alt))) {
            errors.push(label + " alternate " + altIndex + " element mismatch");
          }
        });
        q.products.forEach(function (product) {
          (product.acceptStates || []).forEach(function (state) {
            if (state === product.state) return;
            var typed = q.products.map(function (other) {
              var use = other === product ? state : other.state;
              return other.formula + "(" + use + ")";
            }).join(" + ");
            if (!gradeAnswer(q, typed).correct) errors.push(label + " should accept " + typed);
          });
        });
      });
      if (set.id === "mixed-2" && nrCount < 3) errors.push("mixed-2 needs at least 3 no-reaction items");
      if (set.id !== "mixed-2" && nrCount !== 0) errors.push(set.id + " should not include no reaction");
    });
    if (!gradeAnswer(SETS[2].questions[0], "Zn(s) + CuCl2(aq) -> zncl2(aq) + cu(s)").correct) {
      errors.push("case and full-equation example failed");
    }
    if (!gradeAnswer(SETS[2].questions[0], "Cu(s) and ZnCl2(AQ)").correct) {
      errors.push("'and' separator or state case failed");
    }
    if (gradeAnswer(SETS[2].questions[0], "").empty !== true) errors.push("blank should be empty");
    if (gradeAnswer(SETS[2].questions[0], "ZnCl2 + Cu(s)").correct) {
      errors.push("missing state should be wrong");
    }
    var hydrate = SETS[1].questions[8];
    ["CuSO4(s) + H2O(g)", "CuSO₄(s) + H₂O(l)", "CuSO4(s) + 5H2O(g)"].forEach(function (typed) {
      if (!gradeAnswer(hydrate, typed).correct) errors.push("hydrate should accept " + typed);
    });
    if (!sameFormula("CuSO4·5H2O", "CuSO4.5H2O") || !sameFormula("CuSO4·5H2O", "CuSO4x5H2O")) {
      errors.push("hydrate separators did not match");
    }
    if (!sameFormula("Na2(SO4)", "Na2SO4") || !sameFormula("(NH4)2CO3", "(NH₄)₂CO₃")) {
      errors.push("parentheses or subscript key failed");
    }
    if (sameFormula("Al(OH)3", "AlOH3")) errors.push("should keep required hydroxide parentheses");
    var ammonia = SETS[6].questions[13];
    ["NaCl(aq) + NH3(g) + H2O(l)", "H2O(l) + NH3(aq) + NaCl(aq)", "NH4OH(aq) + NaCl(aq)"].forEach(function (typed) {
      if (!gradeAnswer(ammonia, typed).correct) errors.push("ammonia form should accept " + typed);
    });
    if (gradeAnswer(ammonia, "NH3(g) + NaCl(aq)").correct) errors.push("ammonia missing water should fail");
    return errors;
  }

  function formatSample(products) {
    return products.map(function (product) {
      return product.formula + "(" + product.state + ")";
    }).join(" + ");
  }

  function answerKey() {
    return SETS.map(function (set) {
      return {
        name: set.name,
        questions: set.questions.map(function (q, index) {
          return {
            number: index + 1,
            reactants: q.reactants,
            answer: q.nr ? "no reaction" : formatSample(q.products),
            also: (q.alternates || []).map(formatSample),
            flexible: (q.products || []).filter(function (product) {
              return product.acceptStates && product.acceptStates.length > 1;
            }).map(function (product) {
              return product.formula + " (" + product.acceptStates.join(" or ") + ")";
            }),
            explanation: q.explanation
          };
        })
      };
    });
  }

  return {
    SETS: SETS,
    gradeAnswer: gradeAnswer,
    parseAnswer: parseAnswer,
    prettyFormula: prettyFormula,
    formatProductList: formatProductList,
    formulaKey: formulaKey,
    selfCheck: selfCheck,
    answerKey: answerKey,
    isNoReaction: isNoReaction
  };
});
