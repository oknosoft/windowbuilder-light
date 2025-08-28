
export default function ({utils}) {
  utils.loadQR = () => window.QRCode ? Promise.resolve() :
    utils.load_script('/dist/qrcodejs/qrcode.min.js', 'script');
      //.then(() => utils.load_script('/dist/qrcodejs/qrcode.tosjis.min.js', 'script'));
}
