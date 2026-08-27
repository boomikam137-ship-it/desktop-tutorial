/* =========================================
   GOALIFY JAVASCRIPT
========================================= */

let goals = JSON.parse(
    localStorage.getItem("goalifyGoals")
) || [];

let purchases = JSON.parse(
    localStorage.getItem("goalifyPurchases")
) || [];

let selectedProduct = "";

let selectedBuyIndex = null;


/* =========================================
   LOGIN
========================================= */

function login() {

    let name =
        document.getElementById("loginName").value.trim();

    let email =
        document.getElementById("loginEmail").value.trim();

    if (name === "") {

        alert("Please enter your name.");

        return;
    }

    if (email === "" || !email.includes("@")) {

        alert("Please enter a valid email.");

        return;
    }

    localStorage.setItem("goalifyUser", name);

    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("mainWebsite")
        .classList.remove("hidden");

    showSection("home");

    displayGoals();

    displayProgress();

    loadBuyGoals();

    displayHistory();

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

    document.getElementById("mainWebsite")
        .classList.add("hidden");

    document.getElementById("loginPage")
        .classList.remove("hidden");

}


/* =========================================
   SECTION NAVIGATION
========================================= */

function showSection(id) {

    const section =
        document.getElementById(id);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================
   SELECT PRODUCT
========================================= */

function selectProduct(name, amount, button) {

    selectedProduct = name;

    document.querySelectorAll(".product-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    button.classList.add("active");

    document.getElementById("goalName").value =
        name;

    if (amount > 0) {

        document.getElementById("goalAmount").value =
            amount;

    }

}


/* =========================================
   CREATE GOAL
========================================= */

function createGoal() {

    let name =
        document.getElementById("goalName")
            .value.trim();

    let amount =
        Number(
            document.getElementById("goalAmount")
                .value
        );

    let daily =
        Number(
            document.getElementById("dailyAmount")
                .value
        );


    if (name === "") {

        alert("Please choose or enter a goal.");

        return;
    }

    if (amount <= 0) {

        alert("Please enter a valid target amount.");

        return;
    }

    if (daily <= 0) {

        alert("Please enter your daily saving amount.");

        return;
    }


    /* TIME CALCULATION */

    let days =
        Math.ceil(amount / daily);


    let months =
        Math.floor(days / 30);

    let remainingDays =
        days % 30;


    let timeText = "";

    if (months > 0) {

        timeText +=
            months + " month";

        if (months > 1)
            timeText += "s";

    }

    if (remainingDays > 0) {

        if (timeText !== "")
            timeText += " ";

        timeText +=
            remainingDays + " day";

        if (remainingDays > 1)
            timeText += "s";

    }


    let goal = {

        name: name,

        amount: amount,

        daily: daily,

        saved: 0,

        days: days,

        time: timeText,

        created:
            new Date().toLocaleDateString(),

        completed: false

    };


    goals.push(goal);


    localStorage.setItem(
        "goalifyGoals",
        JSON.stringify(goals)
    );


    /* CLEAR FORM */

    document.getElementById("goalName")
        .value = "";

    document.getElementById("goalAmount")
        .value = "";

    document.getElementById("dailyAmount")
        .value = "";


    document.querySelectorAll(".product-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    displayGoals();

    displayProgress();

    loadBuyGoals();


    showPopup(
        "Goal Created 🎯",
        `${name} goal created successfully! 
         You need approximately ${timeText}.`
    );

}


/* =========================================
   DISPLAY GOALS
========================================= */

function displayGoals() {

    let container =
        document.getElementById("goalList");

    container.innerHTML = "";


    if (goals.length === 0) {

        container.innerHTML =
            `<p class="no-data">
                No goals created yet.
             </p>`;

        return;
    }


    goals.forEach((goal, index) => {

        let percent =
            Math.min(
                (goal.saved / goal.amount) * 100,
                100
            );


        let card =
            document.createElement("div");

        card.className =
            "goal-card";


        card.innerHTML = `

            <div class="goal-top">

                <h3>🎯 ${goal.name}</h3>

                <strong>
                    ${percent.toFixed(0)}%
                </strong>

            </div>

            <p>
                Target: ₹${goal.amount}
            </p>

            <p>
                Saved: ₹${goal.saved}
            </p>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${percent}%">
                </div>

            </div>

            <p>
                💰 Daily Target:
                ₹${goal.daily}/day
            </p>

            <p>
                ⏱️ Estimated Time:
                ${goal.time}
            </p>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   PROGRESS / TREE
========================================= */

function displayProgress() {

    let container =
        document.getElementById(
            "progressContainer"
        );

    container.innerHTML = "";


    if (goals.length === 0) {

        container.innerHTML =
            `<p class="no-data">
                Create a goal to see your progress.
             </p>`;

        return;
    }


    goals.forEach((goal, index) => {

        let percent =
            Math.min(
                (goal.saved / goal.amount) * 100,
                100
            );


        let treeEmoji = "🌱";


        if (percent >= 25)
            treeEmoji = "🌿";

        if (percent >= 50)
            treeEmoji = "🌳";

        if (percent >= 75)
            treeEmoji = "🌲";

        if (percent >= 100)
            treeEmoji = "🌳✨";


        let card =
            document.createElement("div");

        card.className =
            "progress-card";


        card.innerHTML = `

            <h2>
                ${goal.name}
            </h2>

            <div class="tree">
                ${treeEmoji}
            </div>

            <h3>
                ${percent.toFixed(0)}% Completed
            </h3>

            <p>
                ₹${goal.saved}
                / ₹${goal.amount}
            </p>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:${percent}%">
                </div>

            </div>

            ${
                percent >= 100

                ? `<h3 style="color:#00b894">
                     🎉 Goal Achieved!
                   </h3>`

                : `

                    <p>
                        Add your savings
                    </p>

                    <div class="save-buttons">

                        <button
                            onclick="addSaving(${index},30)">
                            + ₹30
                        </button>

                        <button
                            onclick="addSaving(${index},100)">
                            + ₹100
                        </button>

                        <button
                            onclick="addSaving(${index},${goal.daily})">
                            Daily ₹${goal.daily}
                        </button>

                    </div>

                  `
            }

        `;


        container.appendChild(card);

    });

}


/* =========================================
   ADD SAVING
========================================= */

function addSaving(index, amount) {

    let goal = goals[index];


    if (goal.saved >= goal.amount) {

        alert("🎉 This goal is already completed!");

        return;
    }


    goal.saved += amount;


    if (goal.saved >= goal.amount) {

        goal.saved = goal.amount;

        goal.completed = true;

        showPopup(
            "🎉 Goal Achieved!",
            `${goal.name} goal is completed! 
             You can now buy your goal.`
        );

    }


    localStorage.setItem(
        "goalifyGoals",
        JSON.stringify(goals)
    );


    displayGoals();

    displayProgress();

    loadBuyGoals();

}


/* =========================================
   BUY GOAL LIST
========================================= */

function loadBuyGoals() {

    let select =
        document.getElementById("buyGoal");


    select.innerHTML =
        `<option value="">
            -- Select Goal --
         </option>`;


    goals.forEach((goal, index) => {

        let option =
            document.createElement("option");

        option.value = index;

        option.textContent =
            `${goal.name} - ₹${goal.amount}`;

        select.appendChild(option);

    });

}


/* =========================================
   BUY DETAILS
========================================= */

function showBuyDetails() {

    let select =
        document.getElementById("buyGoal");

    let index = select.value;

    let details =
        document.getElementById("buyDetails");


    if (index === "") {

        details.innerHTML =
            "Select a goal to continue.";

        return;
    }


    let goal = goals[index];


    let completed =
        goal.saved >= goal.amount;


    details.innerHTML = `

        <h3>🎯 ${goal.name}</h3>

        <p>
            💰 Target:
            <strong>₹${goal.amount}</strong>
        </p>

        <p>
            💵 Saved:
            <strong>₹${goal.saved}</strong>
        </p>

        <p>
            📊 Progress:
            <strong>
                ${Math.min(
                    (goal.saved / goal.amount) * 100,
                    100
                ).toFixed(0)}%
            </strong>
        </p>

        <p>
            ${
                completed
                ? "✅ Ready to Purchase"
                : "⚠️ Goal not completed yet"
            }
        </p>

    `;

}


/* =========================================
   BUY NOW
========================================= */

function buyGoal() {

    let select =
        document.getElementById("buyGoal");

    let index = select.value;


    if (index === "") {

        alert("⚠️ Please select a goal.");

        return;
    }


    let goal = goals[index];


    /*
       IMPORTANT:
       User can only buy after
       reaching target amount.
    */

    if (goal.saved < goal.amount) {

        alert(
            `⚠️ Goal not completed yet!\n\n` +
            `You need ₹${goal.amount - goal.saved} more.`
        );

        return;
    }


    selectedBuyIndex =
        Number(index);


    document.getElementById(
        "paymentGoalName"
    ).textContent =
        "🛍️ " + goal.name;


    document.getElementById(
        "paymentAmount"
    ).textContent =
        "₹" + goal.amount;


    showSection("payment");

}


/* =========================================
   PAYMENT METHOD
========================================= */

function changePayment() {

    let method =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    document.getElementById("upiInput")
        .classList.add("hidden");

    document.getElementById("cardInput")
        .classList.add("hidden");


    if (method === "UPI") {

        document.getElementById("upiInput")
            .classList.remove("hidden");

    }


    if (method === "Card") {

        document.getElementById("cardInput")
            .classList.remove("hidden");

    }

}


/* =========================================
   CONFIRM PAYMENT
========================================= */

function confirmPayment() {

    if (selectedBuyIndex === null) {

        alert("Please select a goal first.");

        return;
    }


    let goal =
        goals[selectedBuyIndex];


    let method =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    /* UPI */

    if (method === "UPI") {

        let upi =
            document.getElementById("upi")
                .value.trim();


        if (upi === "") {

            alert("Please enter your UPI ID.");

            return;
        }

    }


    /* CARD */

    if (method === "Card") {

        let cardInputs =
            document.querySelectorAll(
                "#cardInput input"
            );


        for (
            let input of cardInputs
        ) {

            if (input.value.trim() === "") {

                alert(
                    "Please fill all card details."
                );

                return;
            }

        }

    }


    /* PURCHASE */

    let purchase = {

        goal:
            goal.name,

        amount:
            goal.amount,

        payment:
            method,

        date:
            new Date().toLocaleString(),

        status:
            "Purchased"

    };


    purchases.push(purchase);


    localStorage.setItem(
        "goalifyPurchases",
        JSON.stringify(purchases)
    );


    displayHistory();


    showPopup(
        "🎉 Purchase Successful!",
        `${goal.name} purchased successfully!\n\n` +
        `Amount: ₹${goal.amount}\n` +
        `Payment: ${method}`
    );


    selectedBuyIndex = null;

}


/* =========================================
   HISTORY
========================================= */

function displayHistory() {

    let container =
        document.getElementById(
            "historyList"
        );


    if (purchases.length === 0) {

        container.innerHTML =
            `<p class="no-data">
                📜 No purchases yet.
             </p>`;

        return;
    }


    container.innerHTML = "";


    purchases
        .slice()
        .reverse()
        .forEach(purchase => {

            let item =
                document.createElement("div");

            item.className =
                "history-item";


            item.innerHTML = `

                <div>

                    <h3>
                        🛍️ ${purchase.goal}
                    </h3>

                    <p>
                        💰 ₹${purchase.amount}
                    </p>

                    <p>
                        💳 ${purchase.payment}
                    </p>

                    <p>
                        📅 ${purchase.date}
                    </p>

                </div>

                <div class="purchased">
                    ✓ PURCHASED
                </div>

            `;


            container.appendChild(item);

        });

}


/* =========================================
   FEEDBACK
========================================= */

function sendFeedback() {

    let feedback =
        document.getElementById(
            "feedback"
        ).value.trim();


    if (feedback === "") {

        alert("Please write your feedback.");

        return;
    }


    document.getElementById(
        "feedback"
    ).value = "";


    showPopup(
        "💬 Thank You!",
        "Your feedback has been submitted successfully."
    );

}


/* =========================================
   POPUP
========================================= */

function showPopup(title, message) {

    document.getElementById(
        "popupTitle"
    ).textContent = title;


    document.getElementById(
        "popupMessage"
    ).textContent = message;


    document.getElementById(
        "popup"
    ).classList.add("show");

}


function closePopup() {

    document.getElementById(
        "popup"
    ).classList.remove("show");

}


/* =========================================
   AUTO LOGIN
========================================= */

window.onload = function () {

    let user =
        localStorage.getItem(
            "goalifyUser"
        );


    if (user) {

        document.getElementById(
            "loginPage"
        ).classList.add("hidden");


        document.getElementById(
            "mainWebsite"
        ).classList.remove("hidden");


        displayGoals();

        displayProgress();

        loadBuyGoals();

        displayHistory();

    }

};