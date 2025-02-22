import { defineStore } from 'pinia';
import { sprintf } from 'sprintf-js';

export const useReceiptStore = defineStore('receipt', {
  state: () => ({
    receiptData: null
  }),
  actions: {
    formatReceiptData(data) {
      const centerText = (text, width = 74) => {
        const leftPadding = Math.max(0, Math.floor((width - text.length) / 2));
        return ' '.repeat(leftPadding) + text;
      };

      const leftRightText = (left, right, width = 74) => {
        const space = Math.max(0, width - left.length - right.length);
        return left + ' '.repeat(space) + right;
      };

      const header = `
${centerText('บริษัท วันทูเทรดดิ้ง จำกัด')}
${centerText('เลขที่ 2556 อาคาร 66 ทาวเวอร์ ห้องเลขที่ 706-707 ชั้น 7')}
${centerText('ถ. สุขุมวิท บางนาเหนือ เขตบางนา')}
${centerText('กรุงเทพมหานคร 10260')}
${centerText('โทร.(0)2001-3545')}
${centerText('เลขประจำตัวผู้เสียภาษี 0105563063410')}
${centerText('(บิลเงินสด/ใบกำกับภาษี)')}
${centerText('เอกสารออกเป็นชุด')}
${leftRightText(`รหัสลูกค้า ${data.customer.customercode}`, `เลขที่ ${data.CUOR}`)}
${leftRightText(`ชื่อลูกค้า ${data.customer.customername}`, `วันที่ ${data.OAORDT}`)}
ที่อยู่ ${data.customer.address1} ${data.customer.address2} ${data.customer.address3}
เลขที่ผู้เสียภาษี ${data.customer.taxno}

รายการสินค้า                  ราคา    ส่วนลด  จำนวน     รวม
`;

      const formatItem = (name, price, discount, qty, total) => {
        return sprintf(
          "%-25s %8s %8s %8s %10s",
          name.substring(0, 25).padEnd(25),
          price.padStart(8),
          discount.padStart(8),
          qty.toString().padStart(8),
          total.padStart(10)
        );
      };

      const items = data.items.map(item => formatItem(
        item.itemname,
        parseFloat(item.OBSAPR).toFixed(2),
        '0.00',
        item.OBORQA,
        parseFloat(item.itemamount).toFixed(2)
      )).join('\n');

      const totalText = thaiNumberToWords(data.total);

      const footer = `
ก่อนภาษี: ${parseFloat(data.ex_vat).toFixed(2).padStart(43)}
รวมทั้งสิ้น: ${parseFloat(data.total).toFixed(2).padStart(43)}
ภาษี: ${parseFloat(data.vat).toFixed(2).padStart(43)}

${leftRightText('', `(${totalText})`, 74)}
${leftRightText('พนักงาน 24980', '................................................', 74)}
${leftRightText('', 'ลายเซ็นลูกค้า', 70)}
      `;

      return header + items + footer;
    }
  }
});

const convert = (number) => {
  const values = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const places = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  const exceptions = { 'หนึ่งสิบ': 'สิบ', 'สองสิบ': 'ยี่สิบ', 'สิบหนึ่ง': 'สิบเอ็ด' };

  let output = '';

  number.toString().split('').reverse().forEach((value, place) => {
    if (place % 6 === 0 && place > 0) {
      output = places[6] + output;
    }

    if (value !== '0') {
      output = values[value] + places[place % 6] + output;
    }
  });

  for (const [search, replace] of Object.entries(exceptions)) {
    output = output.replace(search, replace);
  }

  return output;
};

const thaiNumberToWords = (amount) => {
  const [integer, fraction] = Math.abs(amount).toFixed(2).split('.');

  const baht = convert(integer);
  const satang = convert(fraction);
  let output = amount < 0 ? 'ลบ' : '';
  output += baht ? baht + 'บาท' : '';
  output += satang ? satang + 'สตางค์' : 'ถ้วน';

  return baht + satang === '' ? 'ศูนย์บาทถ้วน' : output;
};
