document.addEventListener('DOMContentLoaded', function() {
    // Sample data for the system
    let products = [
        { id: 1, name: "Paracetamol 500mg", category: "medicine", batch: "B12345", expiry: "2024-12-31", price: 5.99, stock: 150, reorder: 20 },
        { id: 2, name: "Vitamin C 1000mg", category: "supplement", batch: "B23456", expiry: "2025-06-30", price: 12.99, stock: 80, reorder: 15 },
        { id: 3, name: "Blood Pressure Monitor", category: "equipment", batch: "B34567", expiry: "2027-01-15", price: 49.99, stock: 12, reorder: 5 },
        { id: 4, name: "Hand Sanitizer", category: "personal-care", batch: "B45678", expiry: "2025-03-31", price: 3.99, stock: 45, reorder: 10 },
        { id: 5, name: "Ibuprofen 200mg", category: "medicine", batch: "B56789", expiry: "2024-11-30", price: 7.99, stock: 8, reorder: 15 }
    ];

    let customers = [
        { id: 1, name: "John Doe", phone: "555-123-4567", email: "john@example.com", address: "123 Main St", purchases: 5 },
        { id: 2, name: "Jane Smith", phone: "555-987-6543", email: "jane@example.com", address: "456 Oak Ave", purchases: 3 }
    ];

    let suppliers = [
        { id: 1, company: "Pharma Inc", contact: "Mike Johnson", phone: "555-111-2222", email: "mike@pharma.com", address: "789 Business Rd", products: "Paracetamol, Ibuprofen" },
        { id: 2, company: "Health Supplies", contact: "Sarah Williams", phone: "555-333-4444", email: "sarah@health.com", address: "321 Industrial Blvd", products: "Vitamin C, Hand Sanitizer" }
    ];

    let sales = [
        { id: 1001, date: "2023-10-15", customer: "John Doe", items: ["Paracetamol 500mg", "Vitamin C 1000mg"], total: 18.98, payment: "cash" },
        { id: 1002, date: "2023-10-16", customer: "Jane Smith", items: ["Blood Pressure Monitor"], total: 49.99, payment: "card" }
    ];

    let activities = [
        { date: "2023-10-16 09:30", activity: "Added new product: Ibuprofen 200mg", user: "Admin" },
        { date: "2023-10-15 14:15", activity: "Completed sale #1002", user: "Admin" },
        { date: "2023-10-15 11:45", activity: "Added new customer: Jane Smith", user: "Admin" },
        { date: "2023-10-14 16:20", activity: "Completed sale #1001", user: "Admin" }
    ];

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');

            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');

            // Update charts when switching to dashboard
            if (sectionId === 'dashboard') {
                updateDashboardCharts();
            }
        });
    });

    // Dashboard functionality
    function updateDashboard() {
        // Update dashboard cards
        document.getElementById('total-products').textContent = products.length;
        document.getElementById('total-customers').textContent = customers.length;
        
        // Calculate today's sales (mock data)
        const todaySales = sales.filter(sale => sale.date === new Date().toISOString().split('T')[0])
                               .reduce((sum, sale) => sum + sale.total, 0);
        document.getElementById('today-sales').textContent = `$${todaySales.toFixed(2)}`;
        
        // Calculate low stock items
        const lowStockItems = products.filter(product => product.stock <= product.reorder).length;
        document.getElementById('low-stock').textContent = lowStockItems;

        // Update recent activity
        const activityTable = document.getElementById('activity-table');
        activityTable.innerHTML = '';
        activities.slice(0, 5).forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.date}</td>
                <td>${activity.activity}</td>
                <td>${activity.user}</td>
            `;
            activityTable.appendChild(row);
        });
    }

    function updateDashboardCharts() {
        // Sales chart
        const salesCtx = document.getElementById('sales-chart').getContext('2d');
        const salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Monthly Sales',
                    data: [1200, 1900, 1500, 2200, 2000, 2500, 2300],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Inventory chart
        const inventoryCtx = document.getElementById('inventory-chart').getContext('2d');
        const inventoryChart = new Chart(inventoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Medicine', 'Supplement', 'Equipment', 'Personal Care'],
                datasets: [{
                    data: [
                        products.filter(p => p.category === 'medicine').length,
                        products.filter(p => p.category === 'supplement').length,
                        products.filter(p => p.category === 'equipment').length,
                        products.filter(p => p.category === 'personal-care').length
                    ],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(241, 196, 15, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }

    // Inventory functionality
    function updateInventoryTable(filter = '', category = '') {
        const table = document.getElementById('inventory-table');
        table.innerHTML = '';

        let filteredProducts = [...products];
        if (filter) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(filter.toLowerCase())
            );
        }
        if (category) {
            filteredProducts = filteredProducts.filter(product => 
                product.category === category
            );
        }

        filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            const stockClass = product.stock <= product.reorder ? 'text-danger' : '';
            const expiryDate = new Date(product.expiry);
            const today = new Date();
            const expiryClass = expiryDate < today ? 'text-danger' : '';
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                <td>${product.batch}</td>
                <td class="${expiryClass}">${product.expiry}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td class="${stockClass}">${product.stock}</td>
                <td>
                    <button class="btn-edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            table.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                editProduct(productId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }

    // Product modal functionality
    const productModal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');
    const cancelProductBtn = document.getElementById('cancel-product');

    addProductBtn.addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Add New Product';
        productForm.reset();
        document.getElementById('product-id').value = '';
        productModal.style.display = 'flex';
    });

    cancelProductBtn.addEventListener('click', function() {
        productModal.style.display = 'none';
    });

    document.querySelector('.close').addEventListener('click', function() {
        productModal.style.display = 'none';
    });

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('product-id').value;
        const productData = {
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            batch: document.getElementById('batch-number').value,
            expiry: document.getElementById('expiry-date').value,
            price: parseFloat(document.getElementById('selling-price').value),
            stock: parseInt(document.getElementById('quantity').value),
            reorder: parseInt(document.getElementById('reorder-level').value)
        };

        if (productId) {
            // Update existing product
            const index = products.findIndex(p => p.id === parseInt(productId));
            products[index] = { ...products[index], ...productData };
            addActivity(`Updated product: ${productData.name}`);
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...productData });
            addActivity(`Added new product: ${productData.name}`);
        }

        updateInventoryTable();
        updateDashboard();
        productModal.style.display = 'none';
    });

    function editProduct(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;

        document.getElementById('modal-title').textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('batch-number').value = product.batch;
        document.getElementById('expiry-date').value = product.expiry;
        document.getElementById('purchase-price').value = (product.price * 0.7).toFixed(2); // Mock purchase price
        document.getElementById('selling-price').value = product.price;
        document.getElementById('quantity').value = product.stock;
        document.getElementById('reorder-level').value = product.reorder;
        document.getElementById('description').value = product.description || '';

        productModal.style.display = 'flex';
    }

    function deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                const productName = products[index].name;
                products.splice(index, 1);
                addActivity(`Deleted product: ${productName}`);
                updateInventoryTable();
                updateDashboard();
            }
        }
    }

    // Inventory search and filter
    document.getElementById('inventory-search').addEventListener('input', function() {
        updateInventoryTable(this.value, document.getElementById('category-filter').value);
    });

    document.getElementById('category-filter').addEventListener('change', function() {
        updateInventoryTable(document.getElementById('inventory-search').value, this.value);
    });

    // Sales functionality
    function updateSalesTable(filter = '', startDate = '', endDate = '') {
        const table = document.getElementById('sales-table');
        table.innerHTML = '';

        let filteredSales = [...sales];
        if (filter) {
            filteredSales = filteredSales.filter(sale => 
                sale.customer.toLowerCase().includes(filter.toLowerCase()) ||
                sale.id.toString().includes(filter)
            );
        }
        if (startDate && endDate) {
            filteredSales = filteredSales.filter(sale => 
                sale.date >= startDate && sale.date <= endDate
            );
        }

        filteredSales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.date}</td>
                <td>${sale.customer}</td>
                <td>${sale.items.join(', ')}</td>
                <td>$${sale.total.toFixed(2)}</td>
                <td>${sale.payment.charAt(0).toUpperCase() + sale.payment.slice(1)}</td>
                <td>
                    <button class="btn-view" data-id="${sale.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-print" data-id="${sale.id}"><i class="fas fa-print"></i></button>
                </td>
            `;
            table.appendChild(row);
        });
    }

    // Sales modal functionality
    const saleModal = document.getElementById('sale-modal');
    const newSaleBtn = document.getElementById('new-sale-btn');
    const completeSaleBtn = document.getElementById('complete-sale');
    const customerModal = document.getElementById('customer-modal');
    const newCustomerBtn = document.getElementById('new-customer-btn');
    const cancelCustomerBtn = document.getElementById('cancel-customer');
    const customerForm = document.getElementById('customer-form');

    let cart = [];

    newSaleBtn.addEventListener('click', function() {
        cart = [];
        updateProductList();
        updateCart();
        document.getElementById('customer-select').innerHTML = `
            <option value="">Walk-in Customer</option>
            ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        `;
        saleModal.style.display = 'flex';
    });

    document.querySelectorAll('.close')[1].addEventListener('click', function() {
        saleModal.style.display = 'none';
    });

    newCustomerBtn.addEventListener('click', function() {
        customerForm.reset();
        customerModal.style.display = 'flex';
    });

    cancelCustomerBtn.addEventListener('click', function() {
        customerModal.style.display = 'none';
    });

    document.querySelectorAll('.close')[2].addEventListener('click', function() {
        customerModal.style.display = 'none';
    });

    customerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        const customerData = {
            id: newId,
            name: document.getElementById('customer-name').value,
            phone: document.getElementById('customer-phone').value,
            email: document.getElementById('customer-email').value,
            address: document.getElementById('customer-address').value,
            purchases: 0
        };

        customers.push(customerData);
        addActivity(`Added new customer: ${customerData.name}`);
        
        // Update customer select dropdown
        document.getElementById('customer-select').innerHTML = `
            <option value="">Walk-in Customer</option>
            ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        `;
        document.getElementById('customer-select').value = newId;
        
        customerModal.style.display = 'none';
    });

    function updateProductList(filter = '') {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        let filteredProducts = [...products];
        if (filter) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(filter.toLowerCase()) &&
                product.stock > 0
            );
        }

        filteredProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)} | Stock: ${product.stock}</p>
            `;
            productItem.addEventListener('click', function() {
                addToCart(product);
            });
            productList.appendChild(productItem);
        });
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                alert('Not enough stock available');
            }
        } else {
            if (product.stock > 0) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            } else {
                alert('This product is out of stock');
            }
        }
        updateCart();
    }

    function updateCart() {
        const cartList = document.getElementById('cart-list');
        cartList.innerHTML = '';

        let subtotal = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-decrease" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="${products.find(p => p.id === item.id).stock}" data-id="${item.id}">
                    <button class="btn-increase" data-id="${item.id}">+</button>
                    <button class="btn-remove" data-id="${item.id}"><i class="fas fa-times"></i></button>
                </div>
            `;
            cartList.appendChild(cartItem);
            
            subtotal += item.price * item.quantity;
        });

        // Add event listeners to cart item buttons
        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const cartItem = cart.find(item => item.id === itemId);
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                    updateCart();
                }
            });
        });

        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const cartItem = cart.find(item => item.id === itemId);
                const product = products.find(p => p.id === itemId);
                
                if (cartItem.quantity < product.stock) {
                    cartItem.quantity++;
                    updateCart();
                } else {
                    alert('Not enough stock available');
                }
            });
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                cart = cart.filter(item => item.id !== itemId);
                updateCart();
            });
        });

        document.querySelectorAll('.cart-item-actions input').forEach(input => {
            input.addEventListener('change', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const cartItem = cart.find(item => item.id === itemId);
                const product = products.find(p => p.id === itemId);
                const newQuantity = parseInt(this.value);
                
                if (newQuantity >= 1 && newQuantity <= product.stock) {
                    cartItem.quantity = newQuantity;
                    updateCart();
                } else {
                    this.value = cartItem.quantity;
                    alert(`Quantity must be between 1 and ${product.stock}`);
                }
            });
        });

        // Update payment summary
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const tax = (subtotal - discount) * 0.05;
        const total = subtotal - discount + tax;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    document.getElementById('product-search').addEventListener('input', function() {
        updateProductList(this.value);
    });

    document.getElementById('discount').addEventListener('input', function() {
        updateCart();
    });

    completeSaleBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Please add products to the cart');
            return;
        }

        const customerId = document.getElementById('customer-select').value;
        let customerName = 'Walk-in Customer';
        if (customerId) {
            const customer = customers.find(c => c.id === parseInt(customerId));
            customerName = customer.name;
            customer.purchases += 1;
        }

        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = (subtotal - discount) * 0.05;
        const total = subtotal - discount + tax;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        const newSaleId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1001;
        const today = new Date().toISOString().split('T')[0];
        
        const sale = {
            id: newSaleId,
            date: today,
            customer: customerName,
            items: cart.map(item => `${item.name} (${item.quantity})`),
            total: total,
            payment: paymentMethod
        };

        // Update product stock
        cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            product.stock -= cartItem.quantity;
        });

        sales.push(sale);
        addActivity(`Completed sale #${newSaleId}`);
        
        updateSalesTable();
        updateInventoryTable();
        updateDashboard();
        
        saleModal.style.display = 'none';
        alert(`Sale #${newSaleId} completed successfully!`);
    });

    // Sales search and filter
    document.getElementById('sales-search').addEventListener('input', function() {
        updateSalesTable(this.value, document.getElementById('start-date').value, document.getElementById('end-date').value);
    });

    document.getElementById('filter-sales').addEventListener('click', function() {
        updateSalesTable(
            document.getElementById('sales-search').value,
            document.getElementById('start-date').value,
            document.getElementById('end-date').value
        );
    });

    // Customers functionality
    function updateCustomersTable(filter = '') {
        const table = document.getElementById('customers-table');
        table.innerHTML = '';

        let filteredCustomers = [...customers];
        if (filter) {
            filteredCustomers = filteredCustomers.filter(customer => 
                customer.name.toLowerCase().includes(filter.toLowerCase()) ||
                customer.phone.includes(filter) ||
                (customer.email && customer.email.toLowerCase().includes(filter.toLowerCase()))
            );
        }

        filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.email || 'N/A'}</td>
                <td>${customer.address || 'N/A'}</td>
                <td>${customer.purchases}</td>
                <td>
                    <button class="btn-edit" data-id="${customer.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" data-id="${customer.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            table.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const customerId = parseInt(this.getAttribute('data-id'));
                editCustomer(customerId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const customerId = parseInt(this.getAttribute('data-id'));
                deleteCustomer(customerId);
            });
        });
    }

    function editCustomer(id) {
        const customer = customers.find(c => c.id === id);
        if (!customer) return;

        document.getElementById('customer-modal').style.display = 'flex';
        document.getElementById('customer-name').value = customer.name;
        document.getElementById('customer-phone').value = customer.phone;
        document.getElementById('customer-email').value = customer.email || '';
        document.getElementById('customer-address').value = customer.address || '';
        document.getElementById('customer-id').value = customer.id;
    }

    function deleteCustomer(id) {
        if (confirm('Are you sure you want to delete this customer?')) {
            const index = customers.findIndex(c => c.id === id);
            if (index !== -1) {
                const customerName = customers[index].name;
                customers.splice(index, 1);
                addActivity(`Deleted customer: ${customerName}`);
                updateCustomersTable();
            }
        }
    }

    document.getElementById('customer-search').addEventListener('input', function() {
        updateCustomersTable(this.value);
    });

    // Suppliers functionality
    function updateSuppliersTable(filter = '') {
        const table = document.getElementById('suppliers-table');
        table.innerHTML = '';

        let filteredSuppliers = [...suppliers];
        if (filter) {
            filteredSuppliers = filteredSuppliers.filter(supplier => 
                supplier.company.toLowerCase().includes(filter.toLowerCase()) ||
                supplier.contact.toLowerCase().includes(filter.toLowerCase()) ||
                supplier.phone.includes(filter) ||
                (supplier.email && supplier.email.toLowerCase().includes(filter.toLowerCase()))
            );
        }

        filteredSuppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${supplier.id}</td>
                <td>${supplier.company}</td>
                <td>${supplier.contact}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.email || 'N/A'}</td>
                <td>${supplier.products}</td>
                <td>
                    <button class="btn-edit" data-id="${supplier.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-delete" data-id="${supplier.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            table.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.getAttribute('data-id'));
                editSupplier(supplierId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.getAttribute('data-id'));
                deleteSupplier(supplierId);
            });
        });
    }

    // Supplier modal functionality
    const supplierModal = document.getElementById('supplier-modal');
    const addSupplierBtn = document.getElementById('add-supplier-btn');
    const supplierForm = document.getElementById('supplier-form');
    const cancelSupplierBtn = document.getElementById('cancel-supplier');

    addSupplierBtn.addEventListener('click', function() {
        document.getElementById('supplier-modal-title').textContent = 'Add New Supplier';
        supplierForm.reset();
        document.getElementById('supplier-id').value = '';
        supplierModal.style.display = 'flex';
    });

    cancelSupplierBtn.addEventListener('click', function() {
        supplierModal.style.display = 'none';
    });

    document.querySelectorAll('.close')[3].addEventListener('click', function() {
        supplierModal.style.display = 'none';
    });

    supplierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const supplierId = document.getElementById('supplier-id').value;
        const supplierData = {
            company: document.getElementById('supplier-company').value,
            contact: document.getElementById('supplier-contact').value,
            phone: document.getElementById('supplier-phone').value,
            email: document.getElementById('supplier-email').value,
            address: document.getElementById('supplier-address').value,
            products: document.getElementById('supplier-products').value
        };

        if (supplierId) {
            // Update existing supplier
            const index = suppliers.findIndex(s => s.id === parseInt(supplierId));
            suppliers[index] = { ...suppliers[index], ...supplierData };
            addActivity(`Updated supplier: ${supplierData.company}`);
        } else {
            // Add new supplier
            const newId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
            suppliers.push({ id: newId, ...supplierData });
            addActivity(`Added new supplier: ${supplierData.company}`);
        }

        updateSuppliersTable();
        supplierModal.style.display = 'none';
    });

    function editSupplier(id) {
        const supplier = suppliers.find(s => s.id === id);
        if (!supplier) return;

        document.getElementById('supplier-modal-title').textContent = 'Edit Supplier';
        document.getElementById('supplier-id').value = supplier.id;
        document.getElementById('supplier-company').value = supplier.company;
        document.getElementById('supplier-contact').value = supplier.contact;
        document.getElementById('supplier-phone').value = supplier.phone;
        document.getElementById('supplier-email').value = supplier.email || '';
        document.getElementById('supplier-address').value = supplier.address || '';
        document.getElementById('supplier-products').value = supplier.products || '';

        supplierModal.style.display = 'flex';
    }

    function deleteSupplier(id) {
        if (confirm('Are you sure you want to delete this supplier?')) {
            const index = suppliers.findIndex(s => s.id === id);
            if (index !== -1) {
                const supplierName = suppliers[index].company;
                suppliers.splice(index, 1);
                addActivity(`Deleted supplier: ${supplierName}`);
                updateSuppliersTable();
            }
        }
    }

    document.getElementById('supplier-search').addEventListener('input', function() {
        updateSuppliersTable(this.value);
    });

    // Reports functionality
    document.getElementById('report-period').addEventListener('change', function() {
        const customDateGroup = document.querySelector('.custom-date');
        if (this.value === 'custom') {
            customDateGroup.style.display = 'flex';
        } else {
            customDateGroup.style.display = 'none';
        }
    });

    document.getElementById('generate-report').addEventListener('click', function() {
        const reportType = document.getElementById('report-type').value;
        const reportPeriod = document.getElementById('report-period').value;
        
        // Hide all report contents first
        document.querySelectorAll('.report-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show the selected report
        document.getElementById(`${reportType}-report`).style.display = 'block';
        
        // Generate report data based on type and period
        switch(reportType) {
            case 'sales':
                generateSalesReport(reportPeriod);
                break;
            case 'inventory':
                generateInventoryReport();
                break;
            case 'expiry':
                generateExpiryReport();
                break;
            case 'customer':
                generateCustomerReport();
                break;
        }
    });

    function generateSalesReport(period) {
        let filteredSales = [...sales];
        const today = new Date();
        
        // Filter sales based on period
        switch(period) {
            case 'today':
                filteredSales = filteredSales.filter(sale => sale.date === today.toISOString().split('T')[0]);
                break;
            case 'week':
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);
                filteredSales = filteredSales.filter(sale => new Date(sale.date) >= oneWeekAgo);
                break;
            case 'month':
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(today.getMonth() - 1);
                filteredSales = filteredSales.filter(sale => new Date(sale.date) >= oneMonthAgo);
                break;
            case 'quarter':
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                filteredSales = filteredSales.filter(sale => new Date(sale.date) >= threeMonthsAgo);
                break;
            case 'year':
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(today.getFullYear() - 1);
                filteredSales = filteredSales.filter(sale => new Date(sale.date) >= oneYearAgo);
                break;
            case 'custom':
                const startDate = document.getElementById('report-start').value;
                const endDate = document.getElementById('report-end').value;
                if (startDate && endDate) {
                    filteredSales = filteredSales.filter(sale => sale.date >= startDate && sale.date <= endDate);
                }
                break;
        }
        
        // Update sales report table
        const table = document.getElementById('sales-report-table');
        table.innerHTML = '';
        
        filteredSales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.date}</td>
                <td>${sale.id}</td>
                <td>${sale.customer}</td>
                <td>${sale.items.join(', ')}</td>
                <td>$${sale.total.toFixed(2)}</td>
                <td>$0.00</td>
                <td>$${(sale.total * 0.05).toFixed(2)}</td>
                <td>$${sale.total.toFixed(2)}</td>
            `;
            table.appendChild(row);
        });
        
        // Generate sales chart
        const ctx = document.getElementById('sales-report-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: filteredSales.map(sale => sale.date),
                datasets: [{
                    label: 'Sales Amount',
                    data: filteredSales.map(sale => sale.total),
                    backgroundColor: 'rgba(52, 152, 219, 0.7)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function generateInventoryReport() {
        // Update inventory report table
        const table = document.getElementById('inventory-report-table');
        table.innerHTML = '';
        
        products.forEach(product => {
            const status = product.stock <= product.reorder ? 'Low Stock' : 'In Stock';
            const statusClass = status === 'Low Stock' ? 'text-danger' : 'text-success';
            const value = product.price * product.stock;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                <td>${product.stock}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>$${value.toFixed(2)}</td>
                <td class="${statusClass}">${status}</td>
            `;
            table.appendChild(row);
        });
        
        // Generate inventory chart
        const ctx = document.getElementById('inventory-report-chart').getContext('2d');
                new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['In Stock', 'Low Stock'],
                datasets: [{
                    data: [
                        products.filter(p => p.stock > p.reorder).length,
                        products.filter(p => p.stock <= p.reorder).length
                    ],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(231, 76, 60, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    function generateExpiryReport() {
        // Update expiry report table
        const table = document.getElementById('expiry-report-table');
        table.innerHTML = '';
        
        const today = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(today.getMonth() + 3);
        
        products.forEach(product => {
            const expiryDate = new Date(product.expiry);
            const daysLeft = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
            const statusClass = daysLeft <= 30 ? 'text-danger' : (daysLeft <= 90 ? 'text-warning' : '');
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.batch}</td>
                <td>${product.expiry}</td>
                <td class="${statusClass}">${daysLeft > 0 ? daysLeft : 'Expired'}</td>
                <td>${product.stock}</td>
                <td>$${product.price.toFixed(2)}</td>
            `;
            table.appendChild(row);
        });
    }

    function generateCustomerReport() {
        // Update customer report table
        const table = document.getElementById('customer-report-table');
        table.innerHTML = '';
        
        customers.forEach(customer => {
            const customerSales = sales.filter(sale => sale.customer === customer.name);
            const totalPurchases = customerSales.reduce((sum, sale) => sum + sale.total, 0);
            const avgPurchase = customerSales.length > 0 ? totalPurchases / customerSales.length : 0;
            const lastPurchase = customerSales.length > 0 ? 
                customerSales.reduce((latest, sale) => new Date(sale.date) > new Date(latest.date) ? sale : latest).date : 
                'No purchases';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>$${totalPurchases.toFixed(2)}</td>
                <td>${lastPurchase}</td>
                <td>$${avgPurchase.toFixed(2)}</td>
            `;
            table.appendChild(row);
        });
        
        // Generate customer chart
        const ctx = document.getElementById('customer-report-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: customers.map(c => c.name),
                datasets: [{
                    label: 'Total Purchases',
                    data: customers.map(c => 
                        sales.filter(s => s.customer === c.name).reduce((sum, sale) => sum + sale.total, 0)
                    ),
                    backgroundColor: 'rgba(155, 89, 182, 0.7)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Helper function to add activities
    function addActivity(activity) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
        activities.unshift({
            date: `${dateStr} ${timeStr}`,
            activity: activity,
            user: "Admin"
        });
        
        // Keep only the last 50 activities
        if (activities.length > 50) {
            activities.pop();
        }
        
        updateDashboard();
    }

    // Export report functionality
    document.getElementById('export-report').addEventListener('click', function() {
        alert('Report exported successfully! (This would download a file in a real application)');
    });

    // Initialize the application
    updateDashboard();
    updateDashboardCharts();
    updateInventoryTable();
    updateSalesTable();
    updateCustomersTable();
    updateSuppliersTable();
});