module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
            colors: {
              broGreen: "hsl(115, 100%, 40%)",
              broRed: "hsl(10, 90%, 50%)",
              broBlue: "hsl(205, 90%, 60%)",
              broBlueHover: "hsl(205, 90%, 55%)",
            },
          //cursive or sans-serif satnds for font - family
          // its a fallback logic where the browser uses these fonts incase the custom ones don't work
            fontFamily: {
              playball: ['Playball', 'cursive'], 
              play: ['Play', 'sans-serif'],
             },
            fontSize: {
              '28': '28px', // optional custom size
              '36': '36px',
              '40': '40px',

            },
            lineHeight: {
              '1': '1', // optional custom line-height
            },
            backgroundImage: {
              'bgMobile': "url('/brainImage_compd.webp')",
              'bgSm': "url('/brainImageSm_compd.webp')",
              'bgMd': "url('/brainImageMd_compd.webp')",
              'bgLg': "url('/brainImageLg_compd.webp')",
              // 'heroImage': "url('/pexels-mastercowley-713297.jpg')",
              // 'footer-texture': "url('/src/assets/footer-bg.png')",
            },

//make the brain feel like its breathing
             keyframes: {
                'breathe-glow': {
                  '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
                  '50%': { transform: 'scale(1.01)', filter: 'brightness(1.1)' },
                },
              },
              animation: {
                'breathe-glow': 'breathe-glow 12s ease-in-out infinite',
              },

            

    },
  },
  plugins: [],
}

