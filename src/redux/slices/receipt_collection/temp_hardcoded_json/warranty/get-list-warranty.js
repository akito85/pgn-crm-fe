const generateDataDummy = (count) => {
  const result = [];
  const pageSize = 10; // Ukuran standar per halaman
  const today = new Date(); // Titik awal tanggal hari ini

  const cabangPenerbitCat = ["KCP Jakarta Barat", "KCP Bogor", "KCP Depok", "KCP Bekasi"];
  const customerNameCat = ["PLN (PERSERO), PT", "PT.JAYA MOTOR", "SAMPOERNA LAND, PT", "BHIRAWA STEEL PT"];
  const customerSegmentCat = ["KI", "RT", "PK"];
  const penerbitCat = ["Mandiri", "BCA", "BNI", "BRI"];
  const costCenterCat = ["JAKARTA BARAT", "BOGOR", "DEPOK", "BEKASI"];
  const approvalStatusCat = ["Approved", "Rejected", "In Progress"];
  const statusCat = ["Applied", "Unapplied", "Hold", "Reverse"];
  

  // 1. Looping untuk mengisi array result
  for (let i = 1; i <= count; i++) {
    // 1. Membuat Tanggal Utama (H)
    const date1 = new Date();
    date1.setDate(today.getDate() - (i - 1)); 
    const formattedDate = date1.toISOString().split('T')[0];

    // 2. Membuat Tanggal Kedua (H + 1)
    const date2 = new Date(date1); // Copy dari date1 agar tidak merusak aslinya
    date2.setDate(date1.getDate() + 8); // Tambah 1 hari
    const formattedDate2 = date2.toISOString().split('T')[0];

    // 2. Membuat Tanggal Kedua (H + 1)
    const date3 = new Date(date1); // Copy dari date1 agar tidak merusak aslinya
    date3.setDate(date1.getDate() + 360); // Tambah 1 hari
    const formattedDate3 = date3.toISOString().split('T')[0];
    
    const cabangPenerbitRand = cabangPenerbitCat[Math.floor(Math.random() * cabangPenerbitCat.length)];
    const customerNameRand = customerNameCat[Math.floor(Math.random() * customerNameCat.length)];
    const customerSegmentRand = customerSegmentCat[Math.floor(Math.random() * customerSegmentCat.length)];
    const penerbitRand = penerbitCat[Math.floor(Math.random() * penerbitCat.length)];
    const costCenterRand = costCenterCat[Math.floor(Math.random() * costCenterCat.length)];
    const accountNumberRand = Math.floor(Math.random() * 1000000000);
    const approvalStatusRand = approvalStatusCat[Math.floor(Math.random() * approvalStatusCat.length)];
    const statusRand = statusCat[Math.floor(Math.random() * statusCat.length)];

    result.push({
      document: `DOC${i}`,
      mutationDate: formattedDate,
      effectiveDate: formattedDate2,
      expiringDate: formattedDate3,
      endDateClaim: formattedDate,
      cabangPenerbit: `${cabangPenerbitRand}`,
      currency: `IDR`,
      currentBalance: 12000,
      rate: 12000,
      rateDate: formattedDate,
      equivalent: 70000,
      customerName: `${customerNameRand}`,
      customerSegment: `${customerSegmentRand}`,
      customerGroup: `${customerSegmentRand}`,
      type: `CASH`,
      penerbit: penerbitRand,
      paymentWarrantyCode: `PAW${i}`,
      costCenter: `${i}-${costCenterRand}`,
      accountNumber: accountNumberRand,
      accountName: `${customerNameRand}`,
      customerNumber: `CUS${i}`,
      approvalStatus: approvalStatusRand,
      status: statusRand,
      description: `Ini adalah description `,
    });
  }

  // 2. Perhitungan untuk object Page
  const totalElements = result.length;
  const totalPages = Math.ceil(totalElements / pageSize);

  // 3. Mengembalikan struktur sesuai request Anda
  return {
    success: true,
    code: 200,
    message: "Success Get Data Efaktur",
    data: {
      // Jika ingin simulasi per halaman, gunakan: result.slice(0, pageSize)
      result: result, 
      links: [
        {
          rel: "self",
          href: `https://localhost:3000/v1/dbs/api/rbi/get-warranty?page=0&size=${pageSize}&sort=invoiceDate,desc`,
        },
      ],
      page: {
        size: pageSize,
        totalElements: totalElements,
        totalPages: totalPages,
        number: 0, // Halaman saat ini
      },
    },
  };
};

// Cara Penggunaan:
// Misal ingin generate 9 data sesuai contoh Anda:
export const LIST_WARRANTY_DUMMY = generateDataDummy(10);

// Atau jika ingin tes banyak data (misal 55 data):
// const bigData = generateDataDummy(55); 
// Hasilnya totalPages akan otomatis menjadi 6