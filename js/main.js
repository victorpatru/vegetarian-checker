// Adding an event listener on the button which will run our getFetch function
document.querySelector('button').addEventListener('click', getFetch)


// Fetching and manipulating the data from the Open Foods Facts API
function getFetch() {
    // Get the barcode out of the user input box
    let barcode = document.querySelector('#barcode').value

    // Make sure that the barcode is UPC compliant (12 digit barcode)
    if (barcode.length !== 12) {
        alert('Please input a valid 12 digit barcode!')
        return
    }

    // Fetch from the Open Foods Facts API using the user's inputted barcode
    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then(res => res.json())
    .then(data => {

        // Product found
        if (data.status === 1) {
            /* Use the class ProductInfo to manipulate and 
            display the information we get from our user. */
            const item = new ProductInfo(data.product)
            item.showInfo()
            item.listIngredients()
        } 
        
        // Product not found
        else if (data.status === 0) {
            alert(`Product ${barcode} was not found. Try another valid barcode!`)
        }
    })
    .catch(err => console.log(`error ${err}`))
}


class ProductInfo {
    // Setting our constructor with the values we get from the API object
    constructor(productData) {
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
    }

    // Adding the product name and image that is associated with that barcode
    showInfo() {
        document.getElementById('product-img').src = this.image
        document.getElementById('product-name').innerText = this.name
    }

    listIngredients() {
        let tableRef = document.getElementById('ingredient-table')

        // Loop through the ingredients object
        // Add each ingredient on a new table row with a side-by-side checker on whether the ingredient is vegetarian
        for (let key in this.ingredients) {
            let newRow = tableRef.insertRow(-1) // Adding a new row at the bottom of our table ('ingredient-table')

            // Ingredients Column
            let newIngredientCell = newRow.insertCell(0) // Adding a new ingredient cell to the first column of our table
            let newIngredientText = document.createTextNode(this.ingredients[key].text) // Creating the text we are going to next in our ingredients cell column
            newIngredientCell.appendChild(newIngredientText)

            // Vegetarian cell status?
            let vegStatus = this.ingredients[key].vegetarian == null ? 'unknown' : this.ingredients[key].vegetarian // Cleaning the vegetarian output
            let newVegetarianCell = newRow.insertCell(1) // Adding a new vegetarian cell to the second column of our table
            let newVegetarianText = document.createTextNode(vegStatus) // Creating the text we are going to nest in our vegeratin cell column
            newVegetarianCell.appendChild(newVegetarianText)

            if (vegStatus === 'no') {
                newVegetarianCell.classList.add('non-veg-item')
            } else if (vegStatus === 'unknown' || vegStatus === 'maybe') {
                newVegetarianCell.classList.add('unknown-item')
            }


        }
            
    }
}
