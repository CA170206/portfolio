import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROUTE_ITEMS = [
  { id: 'hero', label: 'Home', number: '01' },
  { id: 'about', label: 'About', number: '02' },
  { id: 'projects', label: 'Projects', number: '03' },
  { id: 'experience', label: 'Experience', number: '04' },
  { id: 'skills', label: 'Skills', number: '05' },
  { id: 'certificates', label: 'Certificates', number: '06' },
  { id: 'education', label: 'Education', number: '07' },
  { id: 'github', label: 'GitHub', number: '08' },
  { id: 'linkedin', label: 'LinkedIn', number: '09' },
  { id: 'contact', label: 'Contact', number: '10' },
];

const POINTS = [
  { x: 20, y: 24 },
  { x: 42, y: 84 },
  { x: 20, y: 144 },
  { x: 42, y: 204 },
  { x: 20, y: 264 },
  { x: 42, y: 324 },
  { x: 20, y: 384 },
  { x: 42, y: 444 },
  { x: 20, y: 504 },
  { x: 42, y: 564 },
];

const SVG_WIDTH = 64;
const SVG_HEIGHT = 588;

const SNAKE_PATH = `
  M 20 24
  C 20 54 42 54 42 84
  C 42 114 20 114 20 144
  C 20 174 42 174 42 204
  C 42 234 20 234 20 264
  C 20 294 42 294 42 324
  C 42 354 20 354 20 384
  C 20 414 42 414 42 444
  C 42 474 20 474 20 504
  C 20 534 42 534 42 564
`;

const PATH_SEGMENTS = [
  'M 20 24 C 20 54 42 54 42 84',
  'M 42 84 C 42 114 20 114 20 144',
  'M 20 144 C 20 174 42 174 42 204',
  'M 42 204 C 42 234 20 234 20 264',
  'M 20 264 C 20 294 42 294 42 324',
  'M 42 324 C 42 354 20 354 20 384',
  'M 20 384 C 20 414 42 414 42 444',
  'M 42 444 C 42 474 20 474 20 504',
  'M 20 504 C 20 534 42 534 42 564',
];

export function PortfolioRoute() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [travelAnimation, setTravelAnimation] = useState(null);
  const [showActiveLabel, setShowActiveLabel] = useState(true);
  const [isRouteVisible, setIsRouteVisible] = useState(true);

  const hideTimerRef = useRef(null);

  const isContactActive =
    ROUTE_ITEMS[activeIndex]?.id === 'contact';

  /*
   * Keep the snake visible while the user is interacting
   * with its area, then hide it after 2.5 seconds of
   * inactivity.
   */
  const resetRouteVisibilityTimer = () => {
    setIsRouteVisible(true);

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = window.setTimeout(() => {
      setIsRouteVisible(false);
    }, 2500);
  };

  /*
   * Start the inactivity timer when the component loads.
   */
  useEffect(() => {
    resetRouteVisibilityTimer();

    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  /*
   * Show the active section label for 2 seconds.
   */
  useEffect(() => {
    setShowActiveLabel(true);

    const timer = window.setTimeout(() => {
      setShowActiveLabel(false);
    }, 2000);

    resetRouteVisibilityTimer();

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeIndex]);

  /*
   * Keep the active point synchronized with the page.
   */
  useEffect(() => {
    const handleScroll = () => {
      const sections = ROUTE_ITEMS
        .map((item) => ({
          ...item,
          element: document.getElementById(item.id),
        }))
        .filter((item) => item.element);

      if (!sections.length) return;

      const triggerLine = window.innerHeight * 0.42;

      let currentIndex = 0;

      sections.forEach((section, index) => {
        if (
          section.element.getBoundingClientRect().top <=
          triggerLine
        ) {
          currentIndex = index;
        }
      });

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        currentIndex = sections.length - 1;
      }

      setActiveIndex(currentIndex);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  /*
   * Click any point to navigate to its section.
   */
  const handlePointClick = (index) => {
    resetRouteVisibilityTimer();

    const previousIndex = activeIndex;

    setShowActiveLabel(true);

    if (previousIndex !== index) {
      setTravelAnimation({
        from: previousIndex,
        to: index,
        direction:
          index > previousIndex
            ? 'forward'
            : 'backward',
      });

      window.setTimeout(() => {
        setTravelAnimation(null);
      }, 850);
    }

    setActiveIndex(index);

    const section = document.getElementById(
      ROUTE_ITEMS[index].id
    );

    if (!section) return;

    const navbar = document.querySelector('nav');

    const navbarHeight = navbar
      ? navbar.getBoundingClientRect().height
      : 64;

    let target;

    /*
     * Home and LinkedIn start at the actual beginning
     * of their sections.
     */
    if (
      ROUTE_ITEMS[index].id === 'hero' ||
      ROUTE_ITEMS[index].id === 'linkedin'
    ) {
      target =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;
    } else {
      /*
       * Other sections align their heading near
       * the top of the viewport.
       */
      const heading = section.querySelector('h1, h2');
      const targetElement = heading || section;
      const topGap = 70;

      target =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        topGap;
    }

    window.scrollTo({
      top: Math.max(0, target),
      behavior: 'smooth',
    });
  };

  const activePoint =
    POINTS[activeIndex] || POINTS[0];

  const travelStart = travelAnimation
    ? travelAnimation.from
    : activeIndex;

  const travelEnd = travelAnimation
    ? travelAnimation.to
    : activeIndex;

  const travelSegments = travelAnimation
    ? travelAnimation.direction === 'forward'
      ? PATH_SEGMENTS.slice(
        travelStart,
        travelEnd
      )
      : PATH_SEGMENTS
        .slice(travelEnd, travelStart)
        .reverse()
    : [];

  const routeColor = isContactActive
    ? '#ef4444'
    : '#d6a83a';

  const travelColor = '#f08c46';

  return (
    <aside
      aria-label="Portfolio section navigation"
      onMouseEnter={() => {
        resetRouteVisibilityTimer();
      }}
      onMouseMove={() => {
        resetRouteVisibilityTimer();
      }}
      className={`
        fixed
        left-4
        top-1/2
        z-50
        hidden
        -translate-y-1/2
        lg:block
        xl:left-6
        transition-opacity
        duration-500
        ${isRouteVisible
          ? 'opacity-100'
          : 'opacity-0'
        }
      `}
    >
      <div
        className="
          relative
          h-[588px]
          w-[210px]
          select-none
          -translate-x-[8px]
        "
      >
        {/* SUBTLE VERTICAL GUIDE */}
        <div
          className="
            pointer-events-none
            absolute
            left-[4px]
            top-0
            h-full
            w-px
            bg-slate-300/15
            dark:bg-[#303841]/30
          "
        />

        {/* FIXED SNAKE */}
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            h-full
            w-[64px]
            overflow-visible
          "
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Permanent gray snake */}
          <path
            d={SNAKE_PATH}
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="
              text-slate-300
              dark:text-[#3b434d]
            "
          />

          {/* ACTIVE PATH */}
          {PATH_SEGMENTS.map((segment, index) => {
            if (index >= activeIndex) {
              return null;
            }

            return (
              <motion.path
                key={segment}
                d={segment}
                stroke={routeColor}
                strokeWidth={
                  isContactActive ? 2.4 : 2
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            );
          })}

          {/* Current segment */}
          {activeIndex > 0 && (
            <motion.path
              d={PATH_SEGMENTS[activeIndex - 1]}
              stroke={routeColor}
              strokeWidth={
                isContactActive ? 2.4 : 2
              }
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{
                pathLength: 0,
              }}
              animate={{
                pathLength: 1,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          )}

          {/* TEMPORARY TRAVELLING SNAKE */}
          <AnimatePresence>
            {travelAnimation &&
              travelSegments.map(
                (segment, index) => (
                  <motion.path
                    key={`travel-${travelStart}-${travelEnd}-${index}`}
                    d={segment}
                    stroke={travelColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{
                      pathLength: 0,
                      opacity: 0,
                    }}
                    animate={{
                      pathLength: 1,
                      opacity: [
                        0,
                        1,
                        1,
                        0.85,
                      ],
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.055,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                )
              )}
          </AnimatePresence>

          {/* TEMPORARY TRAVELLING HEAD */}
          <AnimatePresence>
            {travelAnimation && (
              <motion.circle
                key={`travel-head-${travelStart}-${travelEnd}`}
                r="7"
                fill={travelColor}
                stroke="#ffd39a"
                strokeWidth="1.5"
                initial={{
                  cx: POINTS[travelStart].x,
                  cy: POINTS[travelStart].y,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  cx: POINTS[travelEnd].x,
                  cy: POINTS[travelEnd].y,
                  opacity: [0, 1, 1, 0],
                  scale: [
                    0.5,
                    1.2,
                    1,
                    0.7,
                  ],
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            )}
          </AnimatePresence>

          {/* ACTIVE HEAD */}
          <motion.circle
            r={isContactActive ? 6 : 5}
            fill={routeColor}
            initial={{
              cx: POINTS[0].x,
              cy: POINTS[0].y,
            }}
            animate={{
              cx: activePoint.x,
              cy: activePoint.y,
              fill: routeColor,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* ACTIVE HEAD RING */}
          <motion.circle
            fill="none"
            stroke={routeColor}
            strokeWidth="1"
            initial={{
              cx: POINTS[0].x,
              cy: POINTS[0].y,
            }}
            animate={{
              cx: activePoint.x,
              cy: activePoint.y,
              stroke: routeColor,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            r="9"
            opacity="0.25"
          />
        </svg>

        {/* CLICKABLE NAVIGATION POINTS */}
        {ROUTE_ITEMS.map((item, index) => {
          const point = POINTS[index];

          const isActive =
            index === activeIndex;

          const isHovered =
            index === hoveredIndex;

          const isContact =
            item.id === 'contact';

          const pointColor =
            isContact && isActive
              ? '#ef4444'
              : '#d6a83a';

          /*
           * Label is visible when:
           * - point is hovered/focused
           * - point is the active point AND its
           *   2-second visibility timer is active
           */
          const showLabel =
            isHovered ||
            (isActive && showActiveLabel);

          return (
            <div
              key={item.id}
              className="absolute z-20"
              style={{
                left: `${point.x - 15}px`,
                top: `${point.y - 15}px`,
              }}
            >
              <button
                type="button"
                aria-label={`Go to ${item.label}`}
                aria-current={
                  isActive
                    ? 'location'
                    : undefined
                }
                onClick={() =>
                  handlePointClick(index)
                }
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  resetRouteVisibilityTimer();
                }}
                onMouseMove={() => {
                  resetRouteVisibilityTimer();
                }}
                onMouseLeave={() =>
                  setHoveredIndex(null)
                }
                onFocus={() => {
                  setHoveredIndex(index);
                  resetRouteVisibilityTimer();
                }}
                onBlur={() =>
                  setHoveredIndex(null)
                }
                className="
                  group
                  relative
                  flex
                  h-[30px]
                  w-[30px]
                  items-center
                  justify-center
                  rounded-full
                  outline-none
                "
              >
                {/* Active halo */}
                <motion.span
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border
                  "
                  initial={false}
                  animate={{
                    scale: isActive
                      ? 1
                      : 0.65,
                    opacity: isActive
                      ? 0.3
                      : 0,
                    borderColor: pointColor,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                />

                {/* Actual point */}
                <motion.span
                  className="
                    relative
                    block
                    rounded-full
                  "
                  initial={false}
                  animate={{
                    width: isActive
                      ? 10
                      : 7,
                    height: isActive
                      ? 10
                      : 7,
                    backgroundColor:
                      isActive
                        ? pointColor
                        : '#12161b',
                    borderColor:
                      isActive
                        ? pointColor
                        : '#626b75',
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                  style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                />

                {/* SECTION LABEL */}
                <motion.span
                  initial={false}
                  animate={{
                    opacity: showLabel ? 1 : 0,
                    x: showLabel ? 0 : -6,
                    borderColor:
                      isContact && isActive
                        ? '#ef4444'
                        : undefined,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="
                    pointer-events-none
                    absolute
                    left-[38px]
                    top-1/2
                    z-10
                    -translate-y-1/2
                    whitespace-nowrap
                    border
                    border-slate-200
                    bg-white
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    leading-none
                    text-slate-700
                    shadow-sm
                    dark:border-[#303841]
                    dark:bg-[#181d23]
                    dark:text-[#e5e7eb]
                  "
                >
                  <span
                    className="mr-2"
                    style={{
                      color: pointColor,
                    }}
                  >
                    {item.number}
                  </span>

                  {item.label}
                </motion.span>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default PortfolioRoute;