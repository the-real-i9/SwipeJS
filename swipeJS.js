/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable camelcase */
const $_SwipeJS = (element) => ((elem) => {
    if (!elem || !elem.addEventListener) throw new TypeError("You might wanna re-check the element argument it's invalid");
    const swipeTypes = ['swipeup', 'swipedown', 'swipeleft', 'swiperight'];

    const swipeValue = () => new Promise((resolve) => {
        let touchStartX = 0;
        let touchStartY = 0;

        let swipePosX = 0;
        let swipeNegX = 0;
        let swipePosY = 0;
        let swipeNegY = 0;

        let tracker = 0;

        const resetAll = () => {
            touchStartX = 0;
            touchStartY = 0;

            swipePosX = 0;
            swipeNegX = 0;
            swipePosY = 0;
            swipeNegY = 0;

            tracker = 0;
        };

        const updateTouchStart = (ev) => {
            touchStartX = ev.touches[0].clientX;
            touchStartY = ev.touches[0].clientY;
        };

        const updateSwipes = (ev, limit) => {
            if (tracker > limit) return;
            const xDir = ev.touches[0].clientX;
            const yDir = ev.touches[0].clientY;
            if (xDir > touchStartX) {
                swipePosX = xDir;
            } else if (xDir < touchStartX) {
                swipeNegX = xDir;
            }

            if (yDir > touchStartY) {
                swipePosY = yDir;
            } else if (yDir < touchStartY) {
                swipeNegY = yDir;
            }
        };

        const computeSwipeValue = () => {
            const swipeTos = {
                swipePosX,
                swipePosY,
                swipeNegX,
                swipeNegY,
            };

            const swipeTosWithoutZeros = {};
            const swipeBys = {};

            for (const prop in swipeTos) {
                if (swipeTos[prop] === 0) continue;
                swipeTosWithoutZeros[prop] = swipeTos[prop];
            }


            for (const prop in swipeTosWithoutZeros) {
                if (prop.endsWith('X') && prop.includes('Pos')) {
                    swipeBys[`${prop}By`] = swipeTosWithoutZeros[prop] - touchStartX;
                } else if (prop.endsWith('Y') && prop.includes('Pos')) {
                    swipeBys[`${prop}By`] = swipeTosWithoutZeros[prop] - touchStartY;
                } else if (prop.endsWith('X') && prop.includes('Neg')) {
                    swipeBys[`${prop}By`] = touchStartX - swipeTosWithoutZeros[prop];
                } else if (prop.endsWith('Y') && prop.includes('Neg')) {
                    swipeBys[`${prop}By`] = touchStartY - swipeTosWithoutZeros[prop];
                }
            }

            const getMax = (obj) => {
                const [key1, key2] = Object.keys(obj);
                const first = obj[key1];
                const second = obj[key2];
                const maxVal = Math.max(first, second);
                if (maxVal === first) {
                    return key1;
                }
                return key2;
            };
            resetAll();


            if (Object.keys(swipeBys).length === 2) {
                const maxProp = getMax(swipeBys);
                // console.log(maxProp);
                switch (maxProp) {
                    case 'swipePosXBy':
                        return 'swiperight';
                    case 'swipeNegXBy':
                        return 'swipeleft';
                    case 'swipePosYBy':
                        return 'swipedown';
                    case 'swipeNegYBy':
                        return 'swipeup';
                    default:
                }
            } else if (Object.keys(swipeBys).length === 1) {
                const prop = Object.keys(swipeBys).toString();
                // console.log(prop);
                switch (prop) {
                    case 'swipePosXBy':
                        return 'swiperight';
                    case 'swipeNegXBy':
                        return 'swipeleft';
                    case 'swipePosYBy':
                        return 'swipedown';
                    case 'swipeNegYBy':
                        return 'swipeup';
                    default:
                }
            }

            return null;
        };


        elem.addEventListener('touchmove', (ev) => {
            tracker++;
            updateSwipes(ev, 3);
        });


        elem.addEventListener('touchstart', (ev) => {
            updateTouchStart(ev);
        });

        elem.addEventListener('touchend', () => {
            resolve(computeSwipeValue());
        });
    });

    return {
        async addSwipeListener(swipeType, callback) {
            try {
                if (typeof swipeType !== 'string') throw new TypeError("You might wanna check your swipe type... Maybe it's not even a string at all.");
                if (!swipeTypes.includes(swipeType)) throw new TypeError("What could be wrong? Hmmm... You probably mispelt your swipe type. Confirm it's one of swipe(up|down|left|right) e.g. swipeup, :-) you're welcome");
                if (typeof callback !== 'function') throw new TypeError('Are you sure your callback is a function at all???');
            } catch (e) {
                console.error(e);
            }
            for (;;) {
                const swipeVal = await swipeValue();
                if (swipeType === swipeVal) callback("Let me know why you'll need an event argument on GitHub");
            }
        },
    };
})(element);
