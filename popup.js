document.getElementById("searchBtn").addEventListener("click", async function () {
    let tabletName = document.getElementById("tabletName").value.trim();
    if (!tabletName) {
        alert("Please enter a tablet name.");
        return;
    }

    document.getElementById("result").innerHTML = "Fetching data... ";

    try {
        let apiData = await fetchMedicineInfo(tabletName);

        document.getElementById("result").innerHTML = `
            <h3><i class="fa fa-pills"></i> ${tabletName}</h3>
            <strong><i class="fa fa-check-circle"></i> Uses:</strong> ${apiData.uses} <br><br><hr><br><br>
            <strong><i class="fa fa-exclamation-triangle"></i> Side Effects:</strong> ${apiData.sideEffects} <br><br><hr><br><br>
        `;
    } catch (error) {
        document.getElementById("result").innerHTML = " Error fetching data.";
        console.error("Fetch error:", error);
    }
});

async function fetchMedicineInfo(drugName) {
    try {
        let response = await fetch(`https://api.fda.gov/drug/label.json?search=${drugName}&limit=1`);
        let data = await response.json();

        if (data.results && data.results.length > 0) {
            let drug = data.results[0];
            return {
                uses: drug.purpose ? drug.purpose.join(", ") : "Not available",
                sideEffects: drug.warnings ? drug.warnings.join(", ") : "Not available"
            };
        }
    } catch (error) {
        console.error("OpenFDA API error:", error);
    }
    return { uses: "No data found.", sideEffects: "No data found." };
}
