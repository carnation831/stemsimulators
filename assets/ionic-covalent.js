/* Ionic vs covalent practice.
   Level 1 is binary compounds only. Level 2 adds polyatomic ions.

   A part is a metal or a nonmetal. Hydrogen is a nonmetal. Metalloids
   are not used. Ammonium, NH4+, is a polyatomic cation: it is not a metal
   element, but it behaves like a metal in an ionic compound. Polyatomic
   anions (NO3-, SO4 2-, OH-, CO3 2-, PO4 3-) are nonmetal groups.

   Ionic: a metal, or ammonium, with a nonmetal or a nonmetal group.
   Covalent: every part is a nonmetal or a nonmetal group.
*/
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (typeof root !== "undefined") root.IonicCovalent = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function part(symbol, name, kind, charge) {
    return { symbol: symbol, name: name, kind: kind, charge: charge || "" };
  }

  function compound(formula, name, bond, parts, explanation) {
    return {
      formula: formula,
      name: name,
      bond: bond,
      parts: parts,
      explanation: explanation
    };
  }

  var metal = function (symbol, name) { return part(symbol, name, "metal"); };
  var nonmetal = function (symbol, name) { return part(symbol, name, "nonmetal"); };
  var likeMetal = function (symbol, name, charge) { return part(symbol, name, "polyatomic-metal", charge); };
  var nonmetalGroup = function (symbol, name, charge) { return part(symbol, name, "polyatomic-nonmetal", charge); };

  var LEVELS = [
    {
      id: "level1",
      number: 1,
      name: "Level 1: Binary Compounds",
      shortName: "Level 1",
      fileSlug: "ionic-covalent.level1",
      blurb: "15 compounds made of two elements. No polyatomic ions.",
      questions: [
        compound("NaCl", "sodium chloride", "ionic", [metal("Na", "sodium"), nonmetal("Cl", "chlorine")],
          "Sodium is a metal and chlorine is a nonmetal. A metal paired with a nonmetal makes an ionic compound, NaCl."),
        compound("MgO", "magnesium oxide", "ionic", [metal("Mg", "magnesium"), nonmetal("O", "oxygen")],
          "Magnesium is a metal and oxygen is a nonmetal, so magnesium oxide is ionic."),
        compound("CaBr2", "calcium bromide", "ionic", [metal("Ca", "calcium"), nonmetal("Br", "bromine")],
          "Calcium is a metal and bromine is a nonmetal. The 2 in CaBr2 only counts bromine atoms. The compound is ionic."),
        compound("AlCl3", "aluminum chloride", "ionic", [metal("Al", "aluminum"), nonmetal("Cl", "chlorine")],
          "Aluminum is a metal and chlorine is a nonmetal, so aluminum chloride is ionic."),
        compound("K2O", "potassium oxide", "ionic", [metal("K", "potassium"), nonmetal("O", "oxygen")],
          "Potassium is a metal and oxygen is a nonmetal, so potassium oxide is ionic."),
        compound("ZnCl2", "zinc chloride", "ionic", [metal("Zn", "zinc"), nonmetal("Cl", "chlorine")],
          "Zinc is a metal and chlorine is a nonmetal, so zinc chloride is ionic."),
        compound("Fe2O3", "iron(III) oxide", "ionic", [metal("Fe", "iron"), nonmetal("O", "oxygen")],
          "Iron is a metal and oxygen is a nonmetal. Iron(III) oxide, Fe2O3, is ionic."),
        compound("LiF", "lithium fluoride", "ionic", [metal("Li", "lithium"), nonmetal("F", "fluorine")],
          "Lithium is a metal and fluorine is a nonmetal, so lithium fluoride is ionic."),
        compound("H2O", "water", "covalent", [nonmetal("H", "hydrogen"), nonmetal("O", "oxygen")],
          "Hydrogen is a nonmetal, and oxygen is a nonmetal. Two nonmetals share electrons, so water is covalent."),
        compound("CO2", "carbon dioxide", "covalent", [nonmetal("C", "carbon"), nonmetal("O", "oxygen")],
          "Carbon and oxygen are both nonmetals, so carbon dioxide is covalent."),
        compound("NH3", "ammonia", "covalent", [nonmetal("N", "nitrogen"), nonmetal("H", "hydrogen")],
          "Nitrogen and hydrogen are both nonmetals, so ammonia is covalent. NH3 is a molecule. It is not the ammonium ion, NH4+."),
        compound("HCl", "hydrogen chloride", "covalent", [nonmetal("H", "hydrogen"), nonmetal("Cl", "chlorine")],
          "Hydrogen is a nonmetal and chlorine is a nonmetal, so HCl is covalent. It can form ions in water, but the bond in the molecule is covalent."),
        compound("CH4", "methane", "covalent", [nonmetal("C", "carbon"), nonmetal("H", "hydrogen")],
          "Carbon and hydrogen are both nonmetals, so methane is covalent."),
        compound("PCl3", "phosphorus trichloride", "covalent", [nonmetal("P", "phosphorus"), nonmetal("Cl", "chlorine")],
          "Phosphorus and chlorine are both nonmetals, so phosphorus trichloride is covalent."),
        compound("SO2", "sulfur dioxide", "covalent", [nonmetal("S", "sulfur"), nonmetal("O", "oxygen")],
          "Sulfur and oxygen are both nonmetals, so sulfur dioxide is covalent.")
      ]
    },
    {
      id: "level2",
      number: 2,
      name: "Level 2: Polyatomic Ions",
      shortName: "Level 2",
      fileSlug: "ionic-covalent.level2",
      blurb: "15 compounds. Polyatomic ions are mixed with covalent molecules.",
      questions: [
        compound("NaNO3", "sodium nitrate", "ionic", [metal("Na", "sodium"), nonmetalGroup("NO3", "nitrate", "−")],
          "Sodium is a metal. Nitrate, NO3−, is a polyatomic ion made of nonmetals, so it is a nonmetal group. A metal with a nonmetal group is ionic."),
        compound("CaCO3", "calcium carbonate", "ionic", [metal("Ca", "calcium"), nonmetalGroup("CO3", "carbonate", "2−")],
          "Calcium is a metal. Carbonate, CO3 2−, is a polyatomic nonmetal group. Calcium carbonate is ionic."),
        compound("KOH", "potassium hydroxide", "ionic", [metal("K", "potassium"), nonmetalGroup("OH", "hydroxide", "−")],
          "Potassium is a metal. Hydroxide, OH−, is a polyatomic nonmetal group. Potassium hydroxide is ionic."),
        compound("MgSO4", "magnesium sulfate", "ionic", [metal("Mg", "magnesium"), nonmetalGroup("SO4", "sulfate", "2−")],
          "Magnesium is a metal. Sulfate, SO4 2−, is a polyatomic nonmetal group. Magnesium sulfate is ionic."),
        compound("Na3PO4", "sodium phosphate", "ionic", [metal("Na", "sodium"), nonmetalGroup("PO4", "phosphate", "3−")],
          "Sodium is a metal. Phosphate, PO4 3−, is a polyatomic nonmetal group. Sodium phosphate is ionic."),
        compound("NH4Cl", "ammonium chloride", "ionic", [likeMetal("NH4", "ammonium", "+"), nonmetal("Cl", "chlorine")],
          "Ammonium, NH4+, is a polyatomic cation. It is not a metal element, but it behaves like a metal. Chlorine is a nonmetal, so ammonium chloride is ionic."),
        compound("(NH4)2SO4", "ammonium sulfate", "ionic", [likeMetal("NH4", "ammonium", "+"), nonmetalGroup("SO4", "sulfate", "2−")],
          "Ammonium acts like a metal, and sulfate is a polyatomic nonmetal group. Ammonium sulfate is ionic."),
        compound("Cu(NO3)2", "copper(II) nitrate", "ionic", [metal("Cu", "copper"), nonmetalGroup("NO3", "nitrate", "−")],
          "Copper is a metal and nitrate is a polyatomic nonmetal group. Copper(II) nitrate is ionic. The 2 outside the parentheses counts nitrate ions."),
        compound("Ba(OH)2", "barium hydroxide", "ionic", [metal("Ba", "barium"), nonmetalGroup("OH", "hydroxide", "−")],
          "Barium is a metal and hydroxide is a polyatomic nonmetal group. Barium hydroxide is ionic."),
        compound("NH4NO3", "ammonium nitrate", "ionic", [likeMetal("NH4", "ammonium", "+"), nonmetalGroup("NO3", "nitrate", "−")],
          "Ammonium acts like a metal, and nitrate is a nonmetal group. Both parts are polyatomic ions, and ammonium nitrate is ionic."),
        compound("N2O", "dinitrogen monoxide", "covalent", [nonmetal("N", "nitrogen"), nonmetal("O", "oxygen")],
          "Nitrogen and oxygen are both nonmetals. There is no metal and no ammonium, so dinitrogen monoxide is covalent."),
        compound("CS2", "carbon disulfide", "covalent", [nonmetal("C", "carbon"), nonmetal("S", "sulfur")],
          "Carbon and sulfur are both nonmetals, so carbon disulfide is covalent."),
        compound("PCl5", "phosphorus pentachloride", "covalent", [nonmetal("P", "phosphorus"), nonmetal("Cl", "chlorine")],
          "Phosphorus and chlorine are both nonmetals, so phosphorus pentachloride is covalent."),
        compound("HNO3", "nitric acid", "covalent", [nonmetal("H", "hydrogen"), nonmetalGroup("NO3", "nitrate", "−")],
          "Hydrogen is a nonmetal, and nitrate is a polyatomic nonmetal group. Every part is on the nonmetal side, so nitric acid is covalent. It can break into ions in water, but the compound itself is molecular."),
        compound("H2SO4", "sulfuric acid", "covalent", [nonmetal("H", "hydrogen"), nonmetalGroup("SO4", "sulfate", "2−")],
          "Hydrogen is a nonmetal, and sulfate is a polyatomic nonmetal group. Sulfuric acid has no metal and no ammonium, so it is covalent.")
      ]
    }
  ];

  var KIND_LABELS = {
    metal: "Metal",
    nonmetal: "Nonmetal",
    "polyatomic-metal": "Polyatomic, like a metal",
    "polyatomic-nonmetal": "Polyatomic, nonmetal group"
  };

  var BOND_LABELS = {
    ionic: "Ionic",
    covalent: "Covalent"
  };

  return {
    LEVELS: LEVELS,
    KIND_LABELS: KIND_LABELS,
    BOND_LABELS: BOND_LABELS
  };
});
