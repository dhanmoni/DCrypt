module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    mode: "jit",
    theme: {
        fontFamily: {
        display: ["Open Sans", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
        },
        extend: {
        screens: {
            mf: "990px",
        },
        keyframes: {
            "slide-in": {
            "0%": {
                "-webkit-transform": "translateX(120%)",
                transform: "translateX(120%)",
            },
            "100%": {
                "-webkit-transform": "translateX(0%)",
                transform: "translateX(0%)",
            },
            },
            "bounce-slow": {
                "0%": {
                  transform: 'translateY(0)',
                },
                "50%": {
                    transform: 'translateY(-7%)',
                },
                "100%": {
                  transform: 'translateY(0)'
                }
              }
        },
        animation: {
            "slide-in": "slide-in 0.5s ease-out",
            'bounce-slow': 'bounce-slow 2.5s linear infinite',
        },
        },
    },
    variants: {
        extend: {},
    },
    plugins: []
  }