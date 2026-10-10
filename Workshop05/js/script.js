// WS05 student starter / opiskelijan aloituspohja
// Both language versions share this file, so messages are picked by page language.
// Molemmat kieliversiot käyttävät tätä tiedostoa, joten viestit valitaan sivun kielen mukaan.

const isFinnish = document.documentElement.lang === "fi";
const STORAGE_KEY = "ws05Animal";

const messages = isFinnish
    ? {
        nameRequired: "Anna eläimen nimi.",
        speciesRequired: "Anna eläimen laji.",
        noteRequired: "Kirjoita hoitomuistio.",
        noteTooLong: "Hoitomuistio saa olla enintään 150 merkkiä.",
        added: "Eläin lisätty ja tallennettu",
        yearsInvalid: "Anna vuosimääräksi positiivinen kokonaisluku.",
        total: "Yhteensä",
        noDiscount: "Ei alennusta.",
        discount20: "20 %:n alennus (yli 2 vuotta).",
        discount20and5: "20 %:n alennus ja lisäksi 5 € alennus (5 vuotta tai enemmän).",
        noSaved: "Ei tallennettua eläintä vielä.",
        brokenData: "Tallennettua tietoa ei voitu lukea.",
        name: "Nimi",
        species: "Laji",
        note: "Muistio",
        cleared: "Tallennettu eläin poistettu."
    }
    : {
        nameRequired: "Please enter the animal's name.",
        speciesRequired: "Please enter the species.",
        noteRequired: "Please write a care note.",
        noteTooLong: "The care note can be at most 150 characters.",
        added: "Animal added and saved",
        yearsInvalid: "Please enter a positive whole number of years.",
        total: "Total",
        noDiscount: "No discount.",
        discount20: "20% discount (more than 2 years).",
        discount20and5: "20% discount plus an extra €5 discount (5 years or more).",
        noSaved: "No saved animal yet",
        brokenData: "The saved data could not be read.",
        name: "Name",
        species: "Species",
        note: "Note",
        cleared: "Saved animal cleared."
    };

const animalForm = document.getElementById("animalForm");
const animalName = document.getElementById("animalName");
const animalSpecies = document.getElementById("animalSpecies");
const careNote = document.getElementById("careNote");
const nameError = document.getElementById("nameError");
const speciesError = document.getElementById("speciesError");
const noteError = document.getElementById("noteError");
const formResult = document.getElementById("formResult");

function showError(field, errorElement, message) {
    errorElement.textContent = message;
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
}

function clearError(field, errorElement) {
    errorElement.textContent = "";
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
}

// Exercises 1 and 3 / Harjoitukset 1 ja 3
animalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear previous errors / Tyhjennä edelliset virheet
    clearError(animalName, nameError);
    clearError(animalSpecies, speciesError);
    clearError(careNote, noteError);
    formResult.textContent = "";

    // Read and trim values / Lue ja trimmaa arvot
    const name = animalName.value.trim();
    const species = animalSpecies.value.trim();
    const note = careNote.value.trim();
    console.log("Form values:", { name, species, note });

    // Validate / Validoi
    let isValid = true;

    if (name === "") {
        showError(animalName, nameError, messages.nameRequired);
        isValid = false;
    }
    if (species === "") {
        showError(animalSpecies, speciesError, messages.speciesRequired);
        isValid = false;
    }
    if (note === "") {
        showError(careNote, noteError, messages.noteRequired);
        isValid = false;
    } else if (note.length > 150) {
        showError(careNote, noteError, messages.noteTooLong);
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show the result / Näytä tulos
    formResult.textContent = `${messages.added}: ${name} (${species}) – ${note}`;

    // Save as JSON, replacing the previous animal / Tallenna JSONina, korvaa edellinen
    const animal = { name, species, note };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animal));

    loadAnimal();
    animalForm.reset();
});

// Remove the error from a field as soon as it is corrected (bonus)
// Poista virhe kentästä heti kun se on korjattu (bonus)
[
    [animalName, nameError],
    [animalSpecies, speciesError],
    [careNote, noteError]
].forEach(function ([field, errorElement]) {
    field.addEventListener("input", function () {
        const value = field.value.trim();
        if (value !== "" && value.length <= 150) {
            clearError(field, errorElement);
        }
    });
});

// Exercise 2 / Harjoitus 2
const sponsorForm = document.getElementById("sponsorForm");
const animalType = document.getElementById("animalType");
const yearsInput = document.getElementById("years");
const cost = document.getElementById("cost");
const discountMessage = document.getElementById("discountMessage");

sponsorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const annualFee = Number(animalType.value);
    const years = Number(yearsInput.value);

    // Only positive whole years / Vain positiiviset kokonaiset vuodet
    if (!Number.isInteger(years) || years < 1) {
        cost.textContent = `${messages.total}: –`;
        discountMessage.textContent = messages.yearsInvalid;
        return;
    }

    let total = annualFee * years;
    let discountText = messages.noDiscount;

    if (years > 2) {
        total = total * 0.8;
        discountText = messages.discount20;
    }
    if (years >= 5) {
        total = total - 5;
        discountText = messages.discount20and5;
    }

    cost.textContent = `${messages.total}: €${total.toFixed(2)}`;
    discountMessage.textContent = discountText;
});

// Exercise 4 / Harjoitus 4
const loadButton = document.getElementById("loadAnimal");
const clearButton = document.getElementById("clearAnimal");
const savedAnimal = document.getElementById("savedAnimal");

function loadAnimal() {
    const savedText = localStorage.getItem(STORAGE_KEY);

    if (savedText === null) {
        savedAnimal.textContent = messages.noSaved;
        return;
    }

    let animal;
    try {
        animal = JSON.parse(savedText);
    } catch (error) {
        savedAnimal.textContent = messages.brokenData;
        return;
    }

    savedAnimal.textContent =
        `${messages.name}: ${animal.name}\n` +
        `${messages.species}: ${animal.species}\n` +
        `${messages.note}: ${animal.note}`;
}

loadButton.addEventListener("click", loadAnimal);
clearButton.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_KEY);
    savedAnimal.textContent = messages.cleared;
});

// Restore data when the page opens / Palauta tiedot sivun avautuessa
loadAnimal();
