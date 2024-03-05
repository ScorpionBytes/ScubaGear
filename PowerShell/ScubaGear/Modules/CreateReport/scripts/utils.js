/**
 * Checks if Dark Mode session storage variable exists. Creates one if it does not exist.
 * Sets the report's default Dark Mode state using the $DarkMode (JavaScript darkMode) PowerShell variable.
 * @param {string} pageLocation The page where this function is called.
 */
const mountDarkMode = (pageLocation) => {
    try {
        let darkModeCookie = sessionStorage.getItem("darkMode");
        if (darkModeCookie === undefined || darkModeCookie === null) {
            if (darkMode) {
                sessionStorage.setItem("darkMode", 'true');
            }
            else {
                sessionStorage.setItem("darkMode", 'false');
            }
            darkModeCookie = sessionStorage.getItem("darkMode");
        }
        setDarkMode(darkModeCookie);
        document.getElementById('toggle').checked = (darkModeCookie === 'true');
    }
    catch (error) {
        console.error("Error applying dark mode to the " + pageLocation + ": " + error)
    }
}

/**
 * Set the report CSS to light mode or dark mode.
 * @param {string} state true for Dark Mode or false for Light Mode
 */
const setDarkMode = (state) => {
    if (state === 'true') {
        document.getElementsByTagName('html')[0].dataset.theme = "dark";
        document.querySelector("#toggle-text").innerHTML = "Dark Mode";
        sessionStorage.setItem("darkMode", 'true');
    }
    else {
        document.getElementsByTagName('html')[0].dataset.theme = "light";
        document.querySelector("#toggle-text").innerHTML = "Light Mode";
        sessionStorage.setItem("darkMode", 'false');
    }
}

/**
 * Toggles light and dark mode
 */
const toggleDarkMode = () => {
    if (document.getElementById('toggle').checked) {
        setDarkMode('true');
    }
    else {
        setDarkMode('false');
    }
}

/**
 * For each table present in a report, the function adds scope attributes for columns and rows. 
 */
const applyScopeAttributes = () => {
    try {
        // first select all tables
        const tables = document.querySelectorAll("table");

        // each table has two children, <colgroup> and <tbody>
        for(let i = 0; i < tables.length; i++) {
            // <tbody> will at a minimum 2 to many <tr> children
            let tbody = tables[i].querySelector("tbody");
            if(!tbody) throw new Error(
                `Invalid HTML structure, <table> ${i + 1} does not have <tbody> tag.`
            )
            
            // the first <tr> in <tbody> will represents columns. Label each child inside as scope="col"
            // 
            // second <tr> + ... are the rows. 
            // For each <tr>, the first <td> child should be labeled as scope="row", leave the rest 
            let cols, rows;
            if(tbody.children || tbody.children.length > 1) {
                cols = tbody.children[0].querySelectorAll("th");
                for(let th = 0; th < cols.length; th++) {
                    cols[th].setAttribute("scope", "col");
                }

                let trIdx = (tables[i].classList.contains("caps_table")) ? 1 : 0;

                // remove column <tr>; for each remaining <tr> set the scope of first instance of <td> 
                rows = Array.from(tbody.children).slice(1);
                for(let tr = 0; tr < rows.length; tr++) {
                    rows[tr].querySelectorAll("td")[trIdx].setAttribute("scope", "row");
                }
            }
            else throw new Error(
                `Unable to apply scope attributes to columns/rows. The <tbody> of <table ${i + 1} does not contain children or has no rows.`
            )
        }
    }
    catch (error) {
        console.error(`Error in applyScopeAttributes, ${error}`);
    }
}
