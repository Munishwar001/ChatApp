
$(document).ready(function () {
    let count = 0;

    $("#addDataForm").on("submit", function (e) {
        e.preventDefault();

        const name = $("#Name");
        const quantity = $("#Quantity");
        const price = $("#Price");

        const nameValue = name.val().trim();
        const quantityValue = quantity.val().trim();
        const priceValue = price.val().trim();

        const isNameValid = /^[A-Za-z\s]+$/.test(nameValue);
        const isQuantityValid = quantityValue !== "" && Number(quantityValue) > 0;
        const isPriceValid = priceValue !== "" && Number(priceValue) > 0;

        name.removeClass("is-invalid");
        quantity.removeClass("is-invalid");
        price.removeClass("is-invalid");

        let isDuplicateLocal = false;
        $("#dataTable tbody tr").each(function () {
            const existingName = $(this).find("td:eq(1)").text().trim().toLowerCase();
            if (existingName === nameValue.toLowerCase()) {
                isDuplicateLocal = true;
                return false;
            }
        });

        const isDuplicateDB = existingDBNames.some(dbName => dbName.toLowerCase() === nameValue.toLowerCase());

        if (isDuplicateLocal || isDuplicateDB) {
            name.addClass("is-invalid");
            name.next(".invalid-feedback").text("This product name already exists in the table .");
            return;
        }

        if (isNameValid && isQuantityValid && isPriceValid) {
            count++;

            const newRow = `
                <tr>
                    <td>${count}</td>
                    <td>${nameValue}</td>
                    <td>${quantityValue}</td>
                    <td>${priceValue}</td>
                      <td>
                         <button class="btn btn-danger btn-sm delete-btn">
                             <i class="bi bi-trash"></i> Delete
                         </button>
                      </td>
                </tr>`;
            $("#dataTable tbody").append(newRow);
            $("#addDataForm")[0].reset();
        } else {
            if (!isNameValid) name.addClass("is-invalid");
            if (!isQuantityValid) quantity.addClass("is-invalid");
            if (!isPriceValid) price.addClass("is-invalid");
        }
    });


    $(document).on('click', '.modal-footer .btn-primary', function () {
        let products = [];

        $("#dataTable tbody tr").each(function () {
            let name = $(this).find("td:eq(1)").text().trim();
            let quantity = parseInt($(this).find("td:eq(2)").text().trim());
            let price = parseInt($(this).find("td:eq(3)").text().trim());

            if (name && quantity && price) {
                products.push({
                    Name: name,
                    Quantity: quantity,
                    Price: price
                });
            }
        });

        if (products.length === 0) {
            alert("No products to save.");
            return;
        }

        
        $.ajax({
            url: '/Home/SaveProducts',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(products),
            success: function (response) {
                alert(response.message);
                //$("#addDataModal").modal('hide'); 
                document.querySelector('#addDataModal .btn-close').click();
                loadProductTable(); 
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                alert("Failed to save products.");
            }
        });
    });

    $(document).on("click", ".delete-btn", function () {
        if (confirm("Are you sure you want to delete this product?")) {
            $(this).closest("tr").remove();
        }
    });


    $(document).on('click', '#updateBtn', function () {
        $.ajax({
            url: '/Home/GetProductTable',
            type: 'GET',
            success: function (html) {
                $("#updateTableContainer").html(html);

                const table = $(document).find("#updateTableContainer table");

                const headerRow = table.find("thead tr");
                if (headerRow.find("th:contains('Delete')").length === 0) {
                    headerRow.append('<th>Delete</th>');
                }

                table.find("tbody tr").each(function () {
                    const productId = $(this).find("td:first").text().trim();

                    $(this)
                        .find("td:nth-child(2), td:nth-child(3), td:nth-child(4)")
                        .attr("contenteditable", "true");

                    $(this).append(`
                        <td>
                            <button class="btn btn-danger btn-sm deleteUpdate-btn" >
                                <i class="bi bi-trash  d-none" data-id=${btoa(productId)}></i> Delete
                            </button>
                        </td>
                    `);
                });
            },
            error: function () {
                $("#updateTableContainer").html(
                    '<div class="alert alert-danger">Failed to load products.</div>'
                );
            }
        });
    });

  
    $(document).on('click', '#saveUpdatesBtn', function () {
        let isValid = true;
        let invalidRows = [];

        $("#updateTableContainer table tbody tr").each(function (index) {
            let name = $(this).find("td:nth-child(2)").text().trim();
            let quantity = $(this).find("td:nth-child(3)").text().trim();
            let price = $(this).find("td:nth-child(4)").text().trim();

            $(this).find("td").removeClass("table-danger");

            const nameRegex = /^[A-Za-z\s]+$/;

            if (name === "" || !nameRegex.test(name) || quantity === "" || price === "" || quantity <= 0 || price <= 0) {
                isValid = false;
                invalidRows.push(index + 1);
                $(this).find("td:nth-child(2), td:nth-child(3), td:nth-child(4)").addClass("table-danger");
            }
        });

        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Invalid Data",
                text: "Some rows contain empty or invalid fields. Please correct them before saving.",
                confirmButtonColor: "#d33"
            });
            return;
        }

        let updatedData = [];
        $("#updateTableContainer table tbody tr").each(function () {
            updatedData.push({
                id: $(this).find("td:first").text(),
                name: $(this).find("td:nth-child(2)").text().trim(),
                quantity: $(this).find("td:nth-child(3)").text().trim(),
                price: $(this).find("td:nth-child(4)").text().trim(),
                rowElement: $(this) 
            });
        });

        let namesSeen = new Set();
        let isDuplicate = false;
        console.log(existingDBNames);

        updatedData.forEach((product) => {
            const nameLower = product.name.toLowerCase();
            if (namesSeen.has(nameLower)) {
                isDuplicate = true;
                alert(`Duplicate product name found in table: ${product.name}`);
            }
            
            namesSeen.add(nameLower);
        });

        if (isDuplicate) return;

        console.log("Updated Data:", updatedData);

         $.ajax({
             url: '/Home/UpdateProducts',
             type: 'POST',
             contentType: 'application/json', 
             data: JSON.stringify(updatedData),
             success: function () { 
                 Swal.fire("Success", "Products updated successfully!", "success");
                 document.querySelector('#updateDataModal .btn-close').click();
                 loadProductTable();
             }
         });

    });

    $(document).on('click', '.deleteUpdate-btn', function () {
        $(this).closest('tr').remove();



    });


});

