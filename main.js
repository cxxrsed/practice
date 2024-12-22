let clients = [];
let products = [];
let purchases = [];

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Это для добавления клиента
document.getElementById('addClientForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = this[0].value;
    const phone = this[1].value;
    var existing = false;

    clients.forEach((client, index) => {
        if (client.name == name) {
            existing = true;
        }
    })

    if (existing) {
        alert("Клиент уже существует!")
    } else {
        clients.push({ name, phone });
        this.reset();
        renderClients();
    }
});

// Это для создания кнопок для панели редактирования клиента/товара
function renderClients() {
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = '';
    clients.forEach((client, index) => {
        clientList.innerHTML += `
            <div class="client-item">
                <span>${client.name} (${client.phone})</span>
                <button onclick="editClient(${index})">Редактировать</button>
                <button onclick="deleteClient(${index})">Удалить</button>
            </div>`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    showSection('clientsSection');
  });

// Функция для редактирования клиента
function editClient(index) {
    const newName = prompt("Введите новое имя:", clients[index].name);
    const newPhone = prompt("Введите новый номер телефона:", clients[index].phone);
    if (newName && newPhone) {
        clients[index] = { name: newName, phone: newPhone };
        renderClients();
    }
}

// Функция для удаления клиента
function deleteClient(index) {
    if (confirm("Вы уверены, что хотите удалить этого клиента?")) {
        clients.splice(index, 1);
        renderClients();
    }
}

// Обработчик для добавления товара
document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = this[0].value;
    const price = parseFloat(this[1].value);
    const quantity = parseInt(this[2].value);
    var existing = false;

    products.forEach((product, index) => {
        if (product.name == name) {
            existing = true;
        }
    })

    if (quantity <= 0) {
        alert("Количество товаров должно быть больше 0!")
    } else if (price <= 0) {
        alert("Цена товара должна быть больше 0!")
    } else if (existing) {
        alert("Продукт с таким именем уже существует!");
    } else {
        products.push({ name, price, quantity });
        this.reset();
        renderProducts();
    }
});

// Функция для отображения товаров
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        productList.innerHTML += `
            <div class="product-item">
                <span>${product.name} - ${product.price}₽ (Количество: ${product.quantity})</span>
                <button onclick="editProduct(${index})">Редактировать</button>
                <button onclick="deleteProduct(${index})">Удалить</button>
            </div>`;
    });
    console.log(products)
}

// Функция для редактирования товара
function editProduct(index) {
    const newName = prompt("Введите новое название товара:", products[index].name);
    const newPrice = prompt("Введите новую цену товара:", products[index].price);
    const newQuantity = prompt("Введите новое количество товара:", products[index].quantity);
    if (newName && !isNaN(newPrice) && !isNaN(newQuantity)) {
        products[index] = { name: newName, price: parseFloat(newPrice), quantity: parseInt(newQuantity) };
        renderProducts();
    }
}

// Функция для удаления товара
function deleteProduct(index) {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
        products.splice(index, 1);
        renderProducts();
    }
}

// Обработчик для добавления покупки
document.getElementById('addPurchaseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = this[0].value;
    const price = parseFloat(this[1].value);
    const quantity = parseInt(this[2].value);
    const clientName = this[3].value;
    const product = products.find(product => product.name === name);
    const client = clients.find(client => client.name === clientName);

    if (product && product.quantity >= quantity && client && quantity > 0) {
        const totalPrice = product.price * quantity;
        purchases.push({ name, price: totalPrice, quantity, clientName });
        product.quantity -= quantity;
        renderProducts();
        renderPurchases();
    } else if (!product) {
        alert('Товара нет в наличии!');
    } else if (!client) {
        alert('Клиента с таким именем не существует!');
    } else if (quantity <= 0) {
        alert("Количество купленных товаров должоно быть больше 0!")
    }
});

// Функция для автоматического рассчёта цены (Кол-во -> цена)
function calculatePrice() {
    const quantityInput = document.getElementById('addPurchaseForm')[2];
    const priceInput = document.getElementById('addPurchaseForm')[1];
    const product = products.find(product => product.name === document.getElementById('addPurchaseForm')[0].value);
    if (product) {
        const totalPrice = product.price * parseInt(quantityInput.value);
        priceInput.value = totalPrice;
    } else {
        priceInput.value = null;
    }
}

// Вызов функции после изменения количества
document.getElementById('addPurchaseForm')[2].addEventListener('input', calculatePrice);
document.getElementById('addPurchaseForm')[0].addEventListener('input', calculatePrice);

// Функция для отображения покупок в списке
function renderPurchases() {
    const purchaseList = document.getElementById('purchaseList');
    purchaseList.innerHTML = '';
    purchases.forEach((purchase, index) => {
        purchaseList.innerHTML += `
            <div class="purchase-item">
                <span>${purchase.name} - ${purchase.price}₽ (Количество: ${purchase.quantity}) - Клиент: ${purchase.clientName}</span>
                <button onclick="editPurchase(${index})">Редактировать</button>
                <button onclick="deletePurchase(${index})">Удалить</button>
            </div>`;
    });
}

// Функция для редактирования покупки
function editPurchase(index) {
    const newName = prompt("Введите новое название покупки:", purchases[index].name);
    const newQuantity = prompt("Введите новое количество:", purchases[index].quantity);
    if (newName && !isNaN(newQuantity)) {
        purchases[index].name = newName;
        purchases[index].quantity = parseInt(newQuantity);
        purchases[index].price = products.find(product => product.name === newName).price * parseInt(newQuantity); // Обновляем цену
        renderPurchases();
    }
}

// Функция для удаления покупки
function deletePurchase(index) {
    if (confirm("Вы уверены, что хотите удалить эту покупку?")) {
        purchases.splice(index, 1);
        renderPurchases();
    }
}