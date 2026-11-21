/* Types of reactions practice.
   Count reactants and products as distinct substances. Coefficients do not
   add a substance: 2H2O is still one product.

   Level 1 has no polyatomic ions. Level 2 includes them. Level 3 also
   includes them, and the shown equation leaves off the product states the
   student must identify. Product states match the existing 5 Types practice:
   water in these reactions is H2O(l), bromine is Br2(l), and dry products
   made with no water solvent stay solid.

   Hydrogen plus oxygen making only water is synthesis on this site.
   Combustion means a carbon compound burns in O2 to make CO2 and H2O.
*/
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof root !== "undefined") root.ReactionTypes = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function item(type, equation, reactants, products, explanation, states) {
    var question = {
      type: type,
      equation: equation,
      reactants: reactants,
      products: products,
      explanation: explanation
    };
    if (states) question.states = states;
    return question;
  }

  function state(formula, value, reason) {
    return { formula: formula, state: value, reason: reason };
  }

  var TYPES = [
    "Synthesis",
    "Decomposition",
    "Single Replacement",
    "Double Replacement",
    "Combustion"
  ];

  var LEVELS = [
    {
      id: "level1",
      number: 1,
      name: "Level 1: No Polyatomic Ions",
      shortName: "Level 1",
      fileSlug: "reaction-types.level1",
      blurb: "15 reactions with no polyatomic ions. Count each side, then name the type.",
      questions: [
        item("Synthesis", "2Na + Cl2 → 2NaCl", 2, 1,
          "Sodium and chlorine are 2 reactants. The 2 in front of Na is a coefficient, so it is still one substance. The only product is NaCl, so that is 1 product. Two substances combining into one product is synthesis."),
        item("Synthesis", "2Mg + O2 → 2MgO", 2, 1,
          "Magnesium and oxygen are 2 reactants. Magnesium oxide is the only product. Two reactants making one product is synthesis."),
        item("Synthesis", "2H2 + O2 → 2H2O", 2, 1,
          "Hydrogen and oxygen are 2 reactants, and water is the only product. On this site, hydrogen plus oxygen making water is synthesis. Combustion is saved for a carbon compound burning in oxygen to make CO2 and H2O."),
        item("Decomposition", "2H2O2 → 2H2O + O2", 1, 2,
          "Hydrogen peroxide is the only reactant. It breaks into water and oxygen, which is 2 products. One substance breaking apart is decomposition."),
        item("Decomposition", "2H2O → 2H2 + O2", 1, 2,
          "Water is 1 reactant. It splits into hydrogen and oxygen, 2 products. The coefficients 2 and 1 do not change the count. This is decomposition."),
        item("Decomposition", "2NH3 → N2 + 3H2", 1, 2,
          "Ammonia, NH3, is one covalent molecule, not a polyatomic ion. It is the only reactant. Nitrogen and hydrogen are 2 products. One reactant breaking apart is decomposition."),
        item("Single Replacement", "Zn + 2HCl → ZnCl2 + H2", 2, 2,
          "Zinc and HCl are 2 reactants. Zinc chloride and hydrogen gas are 2 products. A count of 2 and 2 is not enough by itself. Zinc is an element and it replaces hydrogen, so this is single replacement."),
        item("Single Replacement", "Cl2 + 2NaBr → 2NaCl + Br2", 2, 2,
          "Chlorine and sodium bromide are 2 reactants. Sodium chloride and bromine are 2 products. Chlorine is an element and it replaces bromine, another element. That is single replacement."),
        item("Single Replacement", "Fe + CuCl2 → FeCl2 + Cu", 2, 2,
          "Iron and copper(II) chloride are 2 reactants. Iron(II) chloride and copper are 2 products. Iron replaces copper, so one element takes the place of another. That is single replacement. The salt is FeCl2 because this reaction makes Fe2+."),
        item("Double Replacement", "Na2S + CuCl2 → CuS + 2NaCl", 2, 2,
          "Sodium sulfide and copper(II) chloride are 2 reactants. Copper(II) sulfide and sodium chloride are 2 products. The two compounds swap partners, and no element is alone. That is double replacement. Sulfide, S2−, is a single ion, not a polyatomic ion."),
        item("Double Replacement", "FeS + 2HCl → FeCl2 + H2S", 2, 2,
          "Iron(II) sulfide and hydrogen chloride are 2 compounds, so 2 reactants. Iron(II) chloride and hydrogen sulfide are 2 products. The partners swap. That is double replacement."),
        item("Double Replacement", "CaCl2 + 2NaF → CaF2 + 2NaCl", 2, 2,
          "Calcium chloride and sodium fluoride are 2 reactants. Calcium fluoride and sodium chloride are 2 products. Two compounds trade partners, so this is double replacement."),
        item("Combustion", "CH4 + 2O2 → CO2 + 2H2O", 2, 2,
          "Methane and oxygen are 2 reactants. Carbon dioxide and water are 2 products. The count 2 and 2 also fits single and double replacement. A carbon compound burning in O2 to make CO2 and H2O is combustion."),
        item("Combustion", "C3H8 + 5O2 → 3CO2 + 4H2O", 2, 2,
          "Propane and oxygen are 2 reactants. The products are CO2 and H2O, still 2 substances, even though the coefficients are 3 and 4. A fuel plus oxygen making carbon dioxide and water is combustion."),
        item("Combustion", "C2H5OH + 3O2 → 2CO2 + 3H2O", 2, 2,
          "Ethanol and oxygen are 2 reactants. Carbon dioxide and water are 2 products. Ethanol is one substance even though its formula is longer. Burning it in oxygen is combustion. The OH in ethanol is part of the molecule, not the hydroxide ion.")
      ]
    },
    {
      id: "level2",
      number: 2,
      name: "Level 2: Polyatomic Ions",
      shortName: "Level 2",
      fileSlug: "reaction-types.level2",
      blurb: "15 reactions. These include polyatomic ions such as nitrate, sulfate, hydroxide, and carbonate.",
      questions: [
        item("Synthesis", "CaO + H2O → Ca(OH)2", 2, 1,
          "Calcium oxide and water are 2 reactants. Calcium hydroxide is the only product. Hydroxide, OH−, is a polyatomic ion, and it stays inside that one product. Two reactants making one product is synthesis."),
        item("Synthesis", "Na2O + CO2 → Na2CO3", 2, 1,
          "Sodium oxide and carbon dioxide are 2 reactants. Sodium carbonate is 1 product. Carbonate, CO3 2−, is a polyatomic ion in that product. Two substances combining is synthesis."),
        item("Synthesis", "SO3 + H2O → H2SO4", 2, 1,
          "Sulfur trioxide and water are 2 reactants. Sulfuric acid is the only product. Two reactants combining into one product is synthesis."),
        item("Decomposition", "CaCO3 → CaO + CO2", 1, 2,
          "Calcium carbonate is 1 reactant. Carbonate, CO3 2−, is a polyatomic ion inside it. The products are calcium oxide and carbon dioxide, so 2 products. One compound breaking apart is decomposition."),
        item("Decomposition", "2KClO3 → 2KCl + 3O2", 1, 2,
          "Potassium chlorate is the only reactant. Chlorate, ClO3−, is a polyatomic ion. It breaks into potassium chloride and oxygen, 2 products. The 2 and the 3 are coefficients. This is decomposition."),
        item("Decomposition", "2NaHCO3 → Na2CO3 + H2O + CO2", 1, 3,
          "Baking soda, NaHCO3, is 1 reactant. Hydrogen carbonate, HCO3−, is a polyatomic ion. The products are sodium carbonate, water, and carbon dioxide: 3 substances. One reactant breaking into more than one product is decomposition."),
        item("Single Replacement", "Cu + 2AgNO3 → Cu(NO3)2 + 2Ag", 2, 2,
          "Copper and silver nitrate are 2 reactants. Copper(II) nitrate and silver are 2 products. Nitrate, NO3−, is a polyatomic ion and it stays together. Copper replaces silver, so this is single replacement."),
        item("Single Replacement", "Zn + CuSO4 → ZnSO4 + Cu", 2, 2,
          "Zinc and copper(II) sulfate are 2 reactants. Zinc sulfate and copper are 2 products. Sulfate, SO4 2−, stays in one piece. Zinc replaces copper: single replacement."),
        item("Single Replacement", "2Al + 3CuSO4 → Al2(SO4)3 + 3Cu", 2, 2,
          "Aluminum and copper(II) sulfate are 2 reactants. Aluminum sulfate and copper are 2 products. The subscripts in Al2(SO4)3 belong to one substance. Aluminum replaces copper, so this is single replacement."),
        item("Double Replacement", "AgNO3 + NaCl → AgCl + NaNO3", 2, 2,
          "Silver nitrate and sodium chloride are 2 reactants. Silver chloride and sodium nitrate are 2 products. The two compounds swap partners. Nitrate moves from silver to sodium. That is double replacement."),
        item("Double Replacement", "BaCl2 + Na2SO4 → BaSO4 + 2NaCl", 2, 2,
          "Barium chloride and sodium sulfate are 2 reactants. Barium sulfate and sodium chloride are 2 products. Sulfate, SO4 2−, swaps onto barium. Two compounds trading partners is double replacement."),
        item("Double Replacement", "FeCl3 + 3NaOH → Fe(OH)3 + 3NaCl", 2, 2,
          "Iron(III) chloride and sodium hydroxide are 2 reactants. Iron(III) hydroxide and sodium chloride are 2 products. Hydroxide, OH−, is a polyatomic ion and it moves to the iron. The partners swap, so this is double replacement."),
        item("Combustion", "C2H4 + 3O2 → 2CO2 + 2H2O", 2, 2,
          "Ethene and oxygen are 2 reactants. Carbon dioxide and water are 2 products. A carbon compound burning in O2 to make CO2 and H2O is combustion, even though this equation has no polyatomic ion."),
        item("Combustion", "2C4H10 + 13O2 → 8CO2 + 10H2O", 2, 2,
          "Butane and oxygen are 2 reactants. CO2 and H2O are 2 products. The big numbers 2, 13, 8, and 10 are coefficients, so they are not extra substances. This is combustion."),
        item("Combustion", "2C6H6 + 15O2 → 12CO2 + 6H2O", 2, 2,
          "Benzene and oxygen are 2 reactants. Carbon dioxide and water are 2 products. Complete combustion of a carbon compound gives CO2 and H2O.")
      ]
    },
    {
      id: "level3",
      number: 3,
      name: "Level 3: States of Matter",
      shortName: "Level 3",
      fileSlug: "reaction-types.level3",
      blurb: "15 reactions with polyatomic ions. The product states are missing. You fill in (s), (l), (g), or (aq).",
      questions: [
        item("Synthesis", "4Fe(s) + 3O2(g) → 2Fe2O3", 2, 1,
          "Iron and oxygen are 2 reactants, and iron(III) oxide is 1 product, so this is synthesis. With no water in the reaction, Fe2O3 is a solid.",
          [state("Fe2O3", "(s)", "Iron(III) oxide is an ionic solid at room temperature.")]),
        item("Synthesis", "P4O10(s) + 6H2O(l) → 4H3PO4", 2, 1,
          "Tetraphosphorus decoxide and water are 2 reactants. Phosphoric acid is the only product, so this is synthesis. Extra water is there, and the acid dissolves, so H3PO4 is aqueous.",
          [state("H3PO4", "(aq)", "Phosphoric acid dissolves in the extra water, so it is aqueous.")]),
        item("Synthesis", "2Al(s) + 3Br2(l) → 2AlBr3", 2, 1,
          "Aluminum and bromine are 2 reactants. Aluminum bromide is 1 product, so this is synthesis. No water is present, so the salt is a solid. Bromine itself is a liquid, which is why the reactant is Br2(l).",
          [state("AlBr3", "(s)", "With no water present, aluminum bromide forms a solid.")]),
        item("Decomposition", "(NH4)2CO3(s) → 2NH3 + CO2 + H2O", 1, 3,
          "Ammonium carbonate is 1 reactant. Ammonia, carbon dioxide, and water are 3 products, so this is decomposition. Ammonia and carbon dioxide are gases. In this course the water is a liquid.",
          [
            state("NH3", "(g)", "Ammonia is a gas at room temperature."),
            state("CO2", "(g)", "Carbon dioxide is a gas."),
            state("H2O", "(l)", "Water is written as a liquid in this course.")
          ]),
        item("Decomposition", "2Fe(OH)3(s) → Fe2O3 + 3H2O", 1, 2,
          "Iron(III) hydroxide is 1 reactant. Iron(III) oxide and water are 2 products, so this is decomposition. The oxide is a solid and the water is a liquid.",
          [
            state("Fe2O3", "(s)", "Iron(III) oxide is an ionic solid."),
            state("H2O", "(l)", "Water at room temperature is a liquid.")
          ]),
        item("Decomposition", "2NaHCO3(s) → Na2CO3 + H2O + CO2", 1, 3,
          "Sodium hydrogen carbonate is 1 reactant. Sodium carbonate, water, and carbon dioxide are 3 products, so this is decomposition. No water solvent is there to dissolve the salt, so sodium carbonate stays solid. The water that forms is a liquid, and CO2 is a gas.",
          [
            state("Na2CO3", "(s)", "Dry sodium carbonate, with no water solvent, stays a solid."),
            state("H2O", "(l)", "Water is written as a liquid in this course."),
            state("CO2", "(g)", "Carbon dioxide leaves as a gas.")
          ]),
        item("Single Replacement", "2Al(s) + 3CuSO4(aq) → Al2(SO4)3 + 3Cu", 2, 2,
          "Aluminum and copper(II) sulfate are 2 reactants. Aluminum sulfate and copper are 2 products. Aluminum replaces copper, so this is single replacement. Aluminum sulfate is a soluble sulfate, so it stays aqueous. Copper metal is a solid.",
          [
            state("Al2(SO4)3", "(aq)", "Aluminum sulfate is a soluble sulfate, so it is aqueous."),
            state("Cu", "(s)", "Copper metal is a solid.")
          ]),
        item("Single Replacement", "Mg(s) + 2AgNO3(aq) → Mg(NO3)2 + 2Ag", 2, 2,
          "Magnesium and silver nitrate are 2 reactants. Magnesium nitrate and silver are 2 products. Magnesium replaces silver: single replacement. Every nitrate dissolves, so Mg(NO3)2 is aqueous. Silver metal is a solid.",
          [
            state("Mg(NO3)2", "(aq)", "All nitrates dissolve, so magnesium nitrate is aqueous."),
            state("Ag", "(s)", "Silver metal is a solid.")
          ]),
        item("Single Replacement", "Cl2(g) + 2KBr(aq) → 2KCl + Br2", 2, 2,
          "Chlorine and potassium bromide are 2 reactants. Potassium chloride and bromine are 2 products. Chlorine replaces bromine: single replacement. Potassium salts dissolve, so KCl is aqueous. Elemental bromine is a liquid at room temperature.",
          [
            state("KCl", "(aq)", "Potassium salts dissolve, so KCl is aqueous."),
            state("Br2", "(l)", "Elemental bromine is a liquid at room temperature.")
          ]),
        item("Double Replacement", "BaCl2(aq) + Na2SO4(aq) → BaSO4 + 2NaCl", 2, 2,
          "Barium chloride and sodium sulfate are 2 reactants. Barium sulfate and sodium chloride are 2 products. The partners swap, so this is double replacement. Barium sulfate is an insoluble sulfate, so it is a solid precipitate. Sodium chloride stays dissolved.",
          [
            state("BaSO4", "(s)", "Barium sulfate is an insoluble sulfate, so it precipitates as a solid."),
            state("NaCl", "(aq)", "Sodium salts dissolve, so NaCl stays aqueous.")
          ]),
        item("Double Replacement", "Al2(SO4)3(aq) + 6NaOH(aq) → 2Al(OH)3 + 3Na2SO4", 2, 2,
          "Aluminum sulfate and sodium hydroxide are 2 reactants. Aluminum hydroxide and sodium sulfate are 2 products. Two compounds swap partners: double replacement. Aluminum hydroxide does not dissolve, so it is a solid. Sodium sulfate does dissolve.",
          [
            state("Al(OH)3", "(s)", "Aluminum hydroxide is an insoluble hydroxide, so it is a solid."),
            state("Na2SO4", "(aq)", "Sodium compounds dissolve, so sodium sulfate is aqueous.")
          ]),
        item("Double Replacement", "Ca3(PO4)2(s) + 3H2SO4(aq) → 3CaSO4 + 2H3PO4", 2, 2,
          "Calcium phosphate and sulfuric acid are 2 reactants. Calcium sulfate and phosphoric acid are 2 products. The partners swap, so this is double replacement. Calcium sulfate is one of the sulfates that does not dissolve, so it is a solid. Phosphoric acid in water is aqueous.",
          [
            state("CaSO4", "(s)", "Calcium sulfate has low solubility, so it is a solid."),
            state("H3PO4", "(aq)", "Phosphoric acid dissolves in the water solution, so it is aqueous.")
          ]),
        item("Combustion", "2C4H10(g) + 13O2(g) → 8CO2 + 10H2O", 2, 2,
          "Butane and oxygen are 2 reactants. Carbon dioxide and water are 2 products. A fuel burning in O2 to make CO2 and H2O is combustion. Carbon dioxide is a gas. In this course the water is a liquid.",
          [
            state("CO2", "(g)", "Carbon dioxide is a gas."),
            state("H2O", "(l)", "Water is written as a liquid in this course.")
          ]),
        item("Combustion", "2C6H6(l) + 15O2(g) → 12CO2 + 6H2O", 2, 2,
          "Benzene and oxygen are 2 reactants. Carbon dioxide and water are 2 products, so the count is 2 and 2. Complete combustion makes CO2 gas and liquid water.",
          [
            state("CO2", "(g)", "Carbon dioxide is a gas."),
            state("H2O", "(l)", "Water is written as a liquid in this course.")
          ]),
        item("Combustion", "C2H4(g) + 3O2(g) → 2CO2 + 2H2O", 2, 2,
          "Ethene and oxygen are 2 reactants. Carbon dioxide and water are 2 products. Burning a carbon compound in oxygen is combustion. CO2 is a gas and H2O is a liquid here.",
          [
            state("CO2", "(g)", "Carbon dioxide is a gas."),
            state("H2O", "(l)", "Water is written as a liquid in this course.")
          ])
      ]
    }
  ];

  return {
    LEVELS: LEVELS,
    TYPES: TYPES,
    STATE_OPTIONS: [
      { value: "(s)", label: "(s) Solid" },
      { value: "(l)", label: "(l) Liquid" },
      { value: "(g)", label: "(g) Gas" },
      { value: "(aq)", label: "(aq) Aqueous" }
    ]
  };
});
