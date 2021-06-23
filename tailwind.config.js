const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      letterSpacing: {
        custom: '-0.02em',
      },
      colors: theme => ({
        green: {
          DEFAULT: '#33846E'
        },
        ratingDiv: 'rgba(249, 250, 251, 0.5)',
        borderColor: '#4B5563',
        paymentDark: '#7d838d',
        white: '#FFFFFF',
        darkGrey: '#374151',
        grey: '#f9fafb',
        greyBorder: '#F3F4F6',
        blue: {
          light: '#F9FAFB',
          DEFAULT: '#BAD3CD',
          medium: '#dce9e6',
        },
        orange: {
          DEFAULT: '#FFF7ED',
        },
        border: '#e5e7eb',
      }),
      spacing: {
        //paddings
        '81': '1.1875rem',
        '82': '0.875rem', // padding left -> div (free shipping)
        '83': '0.9375rem', //padding right -> div (free shipping) & shippingdiv
        '84': '0.8125rem', //padding strength div
        '85': '0.47625rem', //padding between vector and typle div
        '86': '1.3125rem', //padding price div
        '87': '1.96875rem', //padding price div
        'search': '0.76562rem', //searchicon padding
        '88': '0.1875rem', //padding summary info
        '89': '1.5625rem', //padding summary info (total Price div )
        '90': '1.0625rem', //padding payment method
        '91': '0.3125rem', //padding payment method
        '92': '0.4375rem', //padding payment method


        //width & height
        '98': '24.75rem', //main div height
        '100': '3.6875rem', //bar div height
        '101': '4.75rem', //main-btm div height
        '102': '39.5rem', //body div height
        '103': '19.125rem', //body div (free shipping) width
        '104': '2.375rem', //body div (free shipping) info height
        '105': '18.5625rem', //body div product name width
        '106': '6.25rem', //body div strength width
        '107': '2.0625rem', //body div strength height
        '108': '5.375rem', //body div strength height
        '109': '2.125rem', //body button height
        '110': '9.4375rem', //price div height
        '111': '47rem', //shipping div height
        '112': '3.25rem', //shipping (input field) div height
        '113': '31.75rem', //shipping (input field) div height
        '114': '7.125rem', //payment method) div height
        '115': '6.625rem', //payment method (term&conditions) div height
        '116': '22.6875rem', //payment method (term&conditions) div height



        //margin
        '200': '1.875rem', //margin product name
        '201': '1.25rem', //margin strength div
        '202': '0.6875rem', //margin strength second div (ml)
        '203': '2.34375rem', //margin strength second div (ml)
        '204': '1.28125rem', //margin type div (ml)
        '205': '2.625rem', //margin price div (ml)
        '206': '2.4375rem', //term&condition div (ml)
        '207': '1.875rem', //shipping div (ml)
        '208': '3.125rem', //shipping div (ml)
        '209': '1.8125rem', //margin product name
        '210': '1.9375rem', //margin product name
        '211': '1.6875rem', //margin shiiping summary page (back button top margin)
        '212': '1.375rem', //payment method div
        '213': '1.125rem', //payment method div
        '214': '0.625rem', //payment method div
        '215': '3.375rem', //banking method div
        '216': '1.0625rem', //banking method div
        '217': '13.375rem', //banking method div


      }
    },
    boxShadow: {
      '2xl': '0 1px 10px 1px rgba(0, 0, 0, 0.1)',
      '3xl': '0 5px 20px 0px rgba(0, 0, 0, 0.1)',
    },
    fontFamily:{
      'inter': ['Inter', 'sans-serif']
    },
    textColor: {
      'black1': '#1F2937',
      'title-color': '#000000',
      'gray-400': '#9CA3AF',
      'gray-600': '#4B5563',
      'orange-500': '#F97316',
      'type-color': '#111827',
      'price-color': '#4B5563',
      'flavour-color': '#6B7280',
      'btn-text-color': '#374151',
      'white': '#FFFFFF',

    },

    fontSize: {
      xxs:['12px', '14.52px'],
      xs: ['10px', '14px'],
      sm: ['12px', '16px'],
      sm1: ['14px', '16.94px'],
      smbtn: ['14px', '16px'],
      base: ['16px', '24px'],
      stepper: ['11px', '16px'],
      heading: ['18px', '24px'],
      totalPrice: ['18px', '21.78px'],
      input: ['14px', '20px'], //font-size for inputs ordersummary page
      lg: ['20px', '24.2px'],
      xl: ['24px', '32px'],
    },
    borderRadius: {
      'sm' : '3px',
      'md-1': '5px',
      'md-2': '6px',
      'lg': '10px',
    },
    container: {
      center: true,
    },

  },
  variants: {
    extend: {
      boxSizing: ['hover', 'focus'],
    },
  },
  plugins: [],
}
