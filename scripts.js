let categories, selectedCategory, selectedCategoryItems;

window.onload = () => {
    fetch('https://api.npoint.io/ceec662bde0d9ba4f7cc/responses/0/0/params/')
        .then(response => response.json())
        .then(data => {
            arrangeCategoryTitlesAndInitialData(data.userCategories);
        })
        .catch((error) => {
            console.log(error);
        });
};


const arrangeCategoryTitlesAndInitialData = (categoryData) => {
    let ctg = [];
    let menu = document.querySelector('.second-row .menu');

    categoryData.forEach((category) => {
        ctg.push({ name: category, shortedName: category.includes('>') ? category.split('>')[1] : category });
    });
    categories = ctg;

    categories.map((category, i) => {
        menu.append(navMaker(category, i));
    })

    setCategory(0, 'Size Özel');
};

const fetchSelectedCategory = () => {
    fetch('https://api.npoint.io/ceec662bde0d9ba4f7cc/responses/0/0/params/recommendedProducts')
        .then(response => response.json())
        .then(data => {
            selectedCategoryItems = data[`${selectedCategory.categoryName}`];
            let swiper = document.querySelector('.swiper-wrapper');
            let loader = document.querySelector('.loader-container');
            selectedCategoryItems.map((item, i) => {
                swiper.append(slideMaker([item.image, item.name, item.priceText, item.params.shippingFee]))
            });
            loader.style.display = "none";

        })
        .catch((error) => {
            console.log(error);
        });
};

const setCategory = (categoryIndex, categoryName) => {
    let swiper = document.querySelector('.swiper-wrapper');
    let loader = document.querySelector('.loader-container');
    let mainTitle = document.querySelector('#mainTitle');

    swiper.innerHTML = '';
    loader.style.display = "flex";
    selectedCategory = { categoryIndex: categoryIndex, categoryName: categoryName };
    mainTitle.innerHTML = selectedCategory.categoryName;
    
    fetchSelectedCategory();
    const navItems = document.querySelectorAll('.nav-item');
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove('selected-nav-item');
    }
    navItems[categoryIndex].classList.add('selected-nav-item');
};

const toastMaker = () => {
    let Toast = document.createElement('div');
    Toast.className='toast';
    let Icon = document.createElement('img');
    Icon.src='../tick.png';
    Icon.width='40';
    let Message = document.createElement('div');
    Message.innerText='Ürün sepete eklendi.'

    Toast.append(Icon,Message);

    document.body.append(Toast);
    setTimeout(() => {
        document.body.removeChild(document.querySelector('.toast'));
    }, 1500);
}

const navMaker = (category, i) => {
    let NavItem = document.createElement('div');
    NavItem.className = 'nav-item';
    NavItem.addEventListener('click', () => setCategory(i, category.name));
    let Text = document.createElement('div');
    Text.className = 'text';
    Text.textContent = category.shortedName;

    NavItem.append(Text);

    return NavItem;

}



const slideMaker = (cardData) => {
    let Slide = document.createElement('div');
    Slide.className = 'swiper-slide';
    let Card = document.createElement('div');
    Card.className = 'card';

    let productConstants = [
        { classname: 'card-image', child: 'img', data: '', src: cardData[0], action: null },
        { classname: 'card-title', child: '', data: cardData[1], src: null, action: null },
        { classname: 'card-price', child: 'h5', data: cardData[2], src: null, action: null },
        { classname: 'card-shipping', child: '', data: cardData[3], src: null, action: null },
        { classname: 'card-button', child: 'button', data: 'Sepete Ekle', src: null, action: { type: 'click', function: toastMaker} },
    ];

    productConstants.forEach(data => {
        let Part = document.createElement('div');
        Part.className = data.classname;
        let Child;
        if (data.child) {
            Child = document.createElement(data.child);
            Child.textContent = data.data;
            if (data.src) {
                Child.src = data.src;
                Child.loading='lazy';
            }
            if (data.action) {
                Child.addEventListener(data.action.type,data.action.function);
            }
            Part.append(Child);
        } else {
            Part.textContent = data.data.includes('FREE') ? '*Ücretsiz Kargo' : data.data;
        }
        Card.append(Part);
    })
    Slide.append(Card);

    return Slide;
};


