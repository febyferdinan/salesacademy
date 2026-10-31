import type { ProductMapping } from './types.js';

export const SEED_PRODUCTS: ProductMapping[] = [
  {
    id: 'internet-dedicated',
    slug: 'internet-dedicated',
    name: 'Internet Dedicated',
    cat: 'Connectivity',
    group: 'Connectivity',
    desc: 'Koneksi internet khusus untuk bisnis dengan bandwidth dedicated 1:1 simetris, SLA terukur, dan dukungan NOC proaktif 24/7.',
    validated: 'Divalidasi Product Team · 02 Okt 2026',
    relatedCourseId: 'internet-dedicated',
    crossSellSlugs: ['sd-wan', 'cloudeka', 'squra-managed-security'],
    roiDefaults: {
      monthlyDedicatedIdr: 12500000,
      monthlyBroadbandIdr: 3500000,
      defaultHourlyRevenueIdr: 25000000,
      defaultDowntimeHoursPerMonth: 2.5,
      slaGuaranteePct: 99.5,
    },
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        body: '<p>Layanan internet korporat dengan alokasi bandwidth khusus satu pelanggan (<strong>rasio 1:1</strong>), kecepatan simetris antara upload dan download, serta jaminan SLA ketersediaan yang mengikat secara kontrak. Dirancang untuk perusahaan yang operasional intinya bergantung penuh pada aplikasi real-time dan cloud.</p>',
      },
      {
        key: 'pain',
        label: 'Customer Pain',
        body: '<ul><li>Aplikasi ERP, CRM, dan sistem kasir/POS melambat drastis di jam sibuk (09.00–16.00)</li><li>Koneksi kantor cabang sering terputus sehingga pengiriman & transaksi tertunda</li><li>Tidak ada kepastian waktu pemulihan (MTTR) maupun kompensasi saat ISP broadband gangguan</li><li>Tim IT internal kewalahan mengurus komplain ke banyak ISP ritel berbeda</li></ul>',
      },
      {
        key: 'icp',
        label: 'Ideal Customer',
        body: '<ul><li>Perusahaan multi-cabang (logistik, ritel modern, perbankan/multifinance, manufaktur, rumah sakit)</li><li>Menjalankan aplikasi kritikal terpusat (SAP/ERP, WMS, Core Banking, HIS)</li><li>Sedang ekspansi cabang/gudang baru atau migrasi beban kerja ke cloud</li></ul><p class="mt-2 text-xs opacity-80"><strong>Buying trigger:</strong> buka cabang/gudang baru, migrasi cloud, audit kepatuhan IT, insiden downtime berulang, atau masa berakhir kontrak ISP lama.</p>',
      },
      {
        key: 'value',
        label: 'Value Proposition',
        body: '<p>Koneksi yang bisa diandalkan untuk bisnis yang tidak boleh berhenti: performa konsisten di jam sibuk, SLA jelas dengan restitusi resmi, dan satu mitra strategis untuk konektivitas, cloud (Cloudeka), serta keamanan siber (SQURA).</p>',
      },
      {
        key: 'features',
        label: 'Key Features',
        body: '<ul><li>Bandwidth dedicated murni 1:1, simetris upload & download</li><li>SLA ketersediaan hingga 99,5%+ dengan kompensasi restitusi tagihan</li><li>Pemantauan proaktif NOC & Enterprise Support 24/7</li><li>Portal monitoring utilisasi trafik & performa real-time</li><li>Alokasi IP Public Static untuk kebutuhan server & VPN korporat</li></ul>',
      },
      {
        key: 'benefits',
        label: 'Business Benefits',
        body: '<ul><li>Produktivitas karyawan dan transaksi cabang tidak terganggu di jam puncak</li><li>Risiko kehilangan omzet dan penalti keterlambatan klien berkurang drastis</li><li>Biaya operasional IT (OPEX) lebih terprediksi tanpa lonjakan biaya tak terduga</li><li>Tim IT fokus pada inovasi bisnis, bukan memadamkan komplain internet harian</li></ul>',
      },
      {
        key: 'usecase',
        label: 'Use Cases',
        body: '<ul><li>Kantor pusat (HQ) yang melayani akses ERP/database terpusat bagi puluhan cabang</li><li>Gudang logistik & hub distribusi dengan sistem manifest/WMS real-time</li><li>Jalur akses stabil & latensi rendah menuju Cloudeka dan Data Center Tier III</li></ul>',
      },
      {
        key: 'diff',
        label: 'Differentiator',
        body: '<p>SLA terukur dengan restitusi kontrak, NOC 24/7 yang memantau secara proaktif sebelum pelanggan melapor, jangkauan infrastruktur nasional Lintasarta, serta integrasi satu pintu dengan portofolio Cloudeka & SQURA. <strong>Selalu bandingkan dengan broadband dari sisi dampak bisnis saat downtime, bukan harga per Mbps.</strong></p>',
      },
      {
        key: 'discovery',
        label: 'Discovery Q',
        quotes: [
          ['“Aplikasi operasional apa yang paling kritikal kalau koneksi terputus selama 1 jam di jam sibuk?”', 'Tujuan: menggali business impact & aplikasi inti'],
          ['“Berapa lama insiden downtime terakhir dan apa dampaknya ke transaksi atau pengiriman?”', 'Tujuan: mengkuantifikasi kerugian rupiah akibat gangguan'],
          ['“Apakah ada rencana membuka cabang/gudang baru atau migrasi beban kerja ke cloud tahun ini?”', 'Tujuan: mengidentifikasi buying trigger & ruang lingkup ekspansi'],
        ],
      },
      {
        key: 'objection',
        label: 'Objection',
        quotes: [
          ['“Paket broadband kompetitor jauh lebih murah per Mbps.”', 'Respons: Validasi perbedaannya, lalu ajak hitung kerugian 1 jam downtime operasional (omzet + produktivitas) dibanding selisih biaya bulanan dedicated.'],
          ['“Kami masih terikat kontrak dengan ISP saat ini.”', 'Respons: Tawarkan masuk sebagai jalur utama/backup High Availability khusus untuk trafik ERP kritikal di HQ, lalu migrasi cabang bertahap saat kontrak berakhir.'],
        ],
      },
      {
        key: 'crosssell',
        label: 'Cross-sell',
        body: '<ul><li><strong>SD-WAN</strong> untuk orkestrasi trafik cerdas dan manajemen banyak cabang terpusat</li><li><strong>Cloudeka</strong> untuk beban kerja server/ERP yang dimigrasikan ke cloud lokal</li><li><strong>SQURA Managed Security</strong> untuk proteksi Anti-DDoS Clean Pipe & pemantauan SOC 24/7</li></ul>',
      },
      {
        key: 'dodont',
        label: "Do & Don't",
        pair: [
          ['Mulai dari kebutuhan bisnis, jumlah cabang, dan aplikasi kritikal', 'Berdebat soal tarif murah per Mbps melawan internet rumahan/broadband'],
          ['Bawa simulasi Kalkulator Kerugian Downtime saat meeting dengan IT & Finance', 'Menjanjikan SLA kustom 100% di luar kontrak standar tanpa persetujuan Presales'],
        ],
      },
    ],
  },
  {
    id: 'sd-wan',
    slug: 'sd-wan',
    name: 'SD-WAN Managed Service',
    cat: 'Connectivity',
    group: 'Connectivity',
    desc: 'Orkestrasi jaringan multi-cabang terpusat dengan pemilihan jalur otomatis berbasis aplikasi, visibilitas penuh, dan efisiensi biaya link.',
    validated: 'Divalidasi Product Team · 10 Okt 2026',
    relatedCourseId: 'internet-dedicated',
    crossSellSlugs: ['internet-dedicated', 'squra-managed-security', 'cloudeka'],
    roiDefaults: {
      monthlyDedicatedIdr: 28000000,
      monthlyBroadbandIdr: 14000000,
      defaultHourlyRevenueIdr: 40000000,
      defaultDowntimeHoursPerMonth: 3,
      slaGuaranteePct: 99.8,
    },
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        body: '<p>Solusi <strong>Software-Defined Wide Area Network (SD-WAN)</strong> terkelola penuh dari Lintasarta yang menyatukan berbagai jenis konektivitas (Internet Dedicated, Metro Ethernet, Broadband, hingga 4G/5G) di seluruh cabang dalam satu dashboard orkestrasi terpusat.</p>',
      },
      {
        key: 'pain',
        label: 'Customer Pain',
        body: '<ul><li>Konfigurasi router manual satu per satu di puluhan cabang memakan waktu berminggu-minggu</li><li>Jalur backup yang sudah dibayar mahal menganggur (idle) dan gagal berpindah otomatis saat link utama putus</li><li>Trafik non-kritikal (YouTube/update OS) memakan habis bandwidth untuk aplikasi SAP/ERP</li><li>Tim IT pusat buta terhadap aplikasi apa yang sedang menyedot bandwidth di tiap cabang</li></ul>',
      },
      {
        key: 'icp',
        label: 'Ideal Customer',
        body: '<ul><li>Perusahaan dengan ≥ 5 hingga ratusan lokasi cabang (perbankan, ritel nasional, logistik, F&B, multifinance)</li><li>Menggunakan kombinasi multi-link di cabang (Dedicated + Broadband/Seluler)</li><li>Membutuhkan Zero-Touch Provisioning untuk pembukaan gerai/cabang cepat</li></ul>',
      },
      {
        key: 'value',
        label: 'Value Proposition',
        body: '<p>Kendali penuh jaringan nasional dari satu layar: failover otomatis tanpa putus sesi aplikasi, prioritas otomatis untuk trafik ERP/Video Call, dan pembukaan cabang baru 5x lebih cepat.</p>',
      },
      {
        key: 'features',
        label: 'Key Features',
        body: '<ul><li>Application-Aware Routing (prioritas otomatis untuk ERP, POS, Teams/Zoom)</li><li>Active-Active Multi-Link Load Balancing & Sub-second Failover</li><li>Zero-Touch Provisioning (ZTP) untuk aktivasi cabang cepat</li><li>Centralized Orchestrator Dashboard & laporan SLA aplikasi</li></ul>',
      },
      {
        key: 'benefits',
        label: 'Business Benefits',
        body: '<ul><li>Memaksimalkan seluruh kapasitas link utama dan backup secara bersamaan</li><li>Pengalaman aplikasi kritikal tetap mulus meski salah satu link mengalami degradasi</li><li>Mengurangi biaya perjalanan teknisi IT ke cabang daerah</li></ul>',
      },
      {
        key: 'usecase',
        label: 'Use Cases',
        body: '<ul><li>Jaringan kantor cabang bank & multifinance dengan transaksi real-time</li><li>Ekspansi cepat gerai ritel & gudang distribusi di seluruh Indonesia</li><li>Direct Cloud Breakout yang aman ke Microsoft 365 & Cloudeka</li></ul>',
      },
      {
        key: 'diff',
        label: 'Differentiator',
        body: '<p>Dikelola penuh (Managed Service) oleh engineer bersertifikat Lintasarta bersama NOC 24/7, bundel langsung dengan underlay Internet Dedicated/Metro Ethernet nasional tanpa perlu koordinasi banyak vendor.</p>',
      },
      {
        key: 'discovery',
        label: 'Discovery Q',
        quotes: [
          ['“Berapa lama waktu yang dibutuhkan tim IT Bapak saat ini untuk mengaktifkan jaringan di 1 cabang baru?”', 'Tujuan: membuka nilai Zero-Touch Provisioning'],
          ['“Bagaimana cara kerja jalur backup di cabang Bapak saat ini—otomatis aktif dalam hitungan milidetik atau masih perlu intervensi manual?”', 'Tujuan: menggali celah failover'],
          ['“Apakah tim IT pusat bisa melihat aplikasi apa saja yang menghabiskan bandwidth di cabang secara real-time?”', 'Tujuan: membuka kebutuhan Application Visibility'],
        ],
      },
      {
        key: 'objection',
        label: 'Objection',
        quotes: [
          ['“Kami sudah punya router biasa di setiap cabang, kenapa perlu tambah biaya SD-WAN?”', 'Respons: Router biasa tidak mengenali prioritas aplikasi dan tidak bisa membagi beban dua link secara cerdas; SD-WAN justru menghemat kebutuhan upgrade bandwidth yang tidak perlu.'],
          ['“Tim IT kami belum pernah mengoperasikan SD-WAN.”', 'Respons: Layanan SD-WAN Lintasarta bersifat Fully Managed—tim kami yang menyiapkan kebijakan routing, memantau 24/7, dan memberikan akses dashboard siap pakai.'],
        ],
      },
      {
        key: 'crosssell',
        label: 'Cross-sell',
        body: '<ul><li><strong>Internet Dedicated & Broadband Bisnis</strong> sebagai jalur underlay ganda di cabang</li><li><strong>SQURA Managed Firewall/SASE</strong> untuk keamanan akses cloud langsung dari cabang</li></ul>',
      },
      {
        key: 'dodont',
        label: "Do & Don't",
        pair: [
          ['Fokus pada kemudahan kelola banyak cabang & kontinuitas aplikasi saat link gagal', 'Menjual SD-WAN ke perusahaan yang hanya punya 1 lokasi kantor tunggal'],
          ['Tawarkan demo dashboard visibilitas aplikasi bersama Presales', 'Membahas detail protokol tunneling yang rumit di hadapan direksi bisnis'],
        ],
      },
    ],
  },
  {
    id: 'metro-ethernet',
    slug: 'metro-ethernet',
    name: 'Metro Ethernet',
    cat: 'Connectivity',
    group: 'Connectivity',
    desc: 'Jaringan privat Layer-2 berkecepatan tinggi dan berlatensi sangat rendah untuk menghubungkan antar kantor pusat, cabang, dan Data Center.',
    validated: 'Divalidasi Product Team · 08 Okt 2026',
    relatedCourseId: 'internet-dedicated',
    crossSellSlugs: ['data-center-tier-3', 'cloudeka', 'internet-dedicated'],
    roiDefaults: {
      monthlyDedicatedIdr: 18000000,
      monthlyBroadbandIdr: 6000000,
      defaultHourlyRevenueIdr: 35000000,
      defaultDowntimeHoursPerMonth: 2,
      slaGuaranteePct: 99.7,
    },
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        body: '<p>Layanan komunikasi data privat berbasis teknologi <strong>Carrier Ethernet (Layer-2)</strong> yang menghubungkan dua lokasi (Point-to-Point) atau banyak lokasi (Point-to-Multipoint / Multipoint-to-Multipoint) secara tertutup tanpa melewati jalur internet publik.</p>',
      },
      {
        key: 'pain',
        label: 'Customer Pain',
        body: '<ul><li>Replikasi database antara kantor pusat dan Data Center/DRC mengalami delay tinggi lewat VPN internet biasa</li><li>Kekhawatiran keamanan dan kepatuhan regulasi jika trafik transaksi internal melewati internet publik</li><li>Butuh throughput besar yang konsisten untuk transfer data masif antar pabrik/gedung</li></ul>',
      },
      {
        key: 'icp',
        label: 'Ideal Customer',
        body: '<ul><li>Perbankan, pasar modal, asuransi, dan korporasi yang memiliki Data Center & DRC terpisah</li><li>Manufaktur dengan pabrik dan kantor pusat yang saling terintegrasi sistem MES/ERP-nya</li><li>Instansi pemerintah & rumah sakit jaringan dengan pertukaran data rekam medis besar</li></ul>',
      },
      {
        key: 'value',
        label: 'Value Proposition',
        body: '<p>Jalur tol privat eksklusif antar lokasi bisnis Anda: latensi ultra-rendah, terisolasi dari ancaman internet publik, dan siap untuk replikasi data sinkron.</p>',
      },
      {
        key: 'features',
        label: 'Key Features',
        body: '<ul><li>Koneksi privat Layer-2 tertutup (Point-to-Point & Multipoint)</li><li>Throughput simetris penuh dengan latensi sangat rendah & jitter minimal</li><li>Dukungan Jumbo Frame & fleksibilitas pengaturan VLAN oleh pelanggan</li><li>SLA tingkat enterprise & pemantauan NOC 24/7</li></ul>',
      },
      {
        key: 'benefits',
        label: 'Business Benefits',
        body: '<ul><li>Replikasi database ke DRC berjalan real-time sesuai target RPO/RTO ketat</li><li>Keamanan trafik internal meningkat karena tidak terekspos ke internet publik</li><li>Kinerja aplikasi terpusat serasa berada di satu LAN gedung yang sama</li></ul>',
      },
      {
        key: 'usecase',
        label: 'Use Cases',
        body: '<ul><li>Interkoneksi Data Center Utama ke Disaster Recovery Center (DRC)</li><li>Koneksi privat HQ ke pabrik utama atau gudang sentral</li><li>Direct private link menuju ekosistem Cloudeka</li></ul>',
      },
      {
        key: 'diff',
        label: 'Differentiator',
        body: '<p>Jaringan backbone fiber optik Lintasarta yang luas dengan integrasi langsung ke seluruh lokasi Data Center Tier III Lintasarta dan Cloudeka.</p>',
      },
      {
        key: 'discovery',
        label: 'Discovery Q',
        quotes: [
          ['“Bagaimana mekanisme replikasi data antara kantor pusat, pabrik, dan Data Center Bapak saat ini?”', 'Tujuan: mengidentifikasi kebutuhan link privat berlatensi rendah'],
          ['“Berapa target RPO dan RTO yang ditetapkan tim Risk/Compliance untuk sinkronisasi DRC?”', 'Tujuan: mengaitkan kebutuhan kapasitas Metro Ethernet dengan standar audit'],
        ],
      },
      {
        key: 'objection',
        label: 'Objection',
        quotes: [
          ['“Kenapa tidak pakai VPN biasa saja di atas internet?”', 'Respons: VPN di atas internet publik tetap berbagi jalur dengan trafik publik sehingga rentan jitter dan latensi fluktuatif saat replikasi database kritikal.'],
        ],
      },
      {
        key: 'crosssell',
        label: 'Cross-sell',
        body: '<ul><li><strong>Data Center Tier III</strong> untuk penempatan rak server DRC</li><li><strong>Cloudeka</strong> untuk private cloud interconnect</li></ul>',
      },
      {
        key: 'dodont',
        label: "Do & Don't",
        pair: [
          ['Tanyakan lokasi koordinat kedua titik (A-end & B-end) untuk pengecekan coverage fiber', 'Menyamakan fungsi Metro Ethernet (jaringan privat tertutup) dengan akses internet publik'],
        ],
      },
    ],
  },
  {
    id: 'data-center-tier-3',
    slug: 'data-center-tier-3',
    name: 'Data Center Tier III',
    cat: 'Data Center',
    group: 'Data Center & Cloud',
    desc: 'Fasilitas Colocation berstandar Tier III dengan Concurrent Maintainability, uptime 99,982%, keamanan fisik berlapis, dan kepatuhan regulasi penuh.',
    validated: 'Divalidasi Product Team · 05 Okt 2026',
    relatedCourseId: 'dc',
    crossSellSlugs: ['metro-ethernet', 'cloudeka', 'squra-managed-security'],
    roiDefaults: {
      monthlyDedicatedIdr: 35000000,
      monthlyBroadbandIdr: 18000000,
      defaultHourlyRevenueIdr: 65000000,
      defaultDowntimeHoursPerMonth: 2,
      slaGuaranteePct: 99.982,
    },
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        body: '<p>Layanan <strong>Colocation & Data Center Tier III</strong> Lintasarta menyediakan infrastruktur ruang server berstandar internasional dengan redundansi daya, pendingin presisi, sistem pencegah kebakaran gas bersih, dan pengamanan fisik 24/7.</p>',
      },
      {
        key: 'pain',
        label: 'Customer Pain',
        body: '<ul><li>Ruang server di gedung kantor sering mengalami masalah suhu panas, listrik padam, dan biaya peremajaan UPS/PAC yang membengkak</li><li>Gagal memenuhi persyaratan audit OJK, BI, ISO 27001, atau PCI-DSS karena fasilitas ruang server internal tidak memadai</li><li>Tim IT harus datang tengah malam ke kantor setiap kali perlu mengecek perangkat fisik</li></ul>',
      },
      {
        key: 'icp',
        label: 'Ideal Customer',
        body: '<ul><li>Perbankan, asuransi, multifinance, sekuritas, dan fintech yang diatur ketat oleh OJK & BI</li><li>Perusahaan menengah-besar yang akan merelokasi kantor atau menghadapi akhir masa pakai UPS/genset ruang server</li><li>Korporasi yang sedang membangun Disaster Recovery Center (DRC)</li></ul>',
      },
      {
        key: 'value',
        label: 'Value Proposition',
        body: '<p>Ubah CAPEX miliaran rupiah menjadi OPEX terukur di fasilitas Tier III dengan jaminan uptime 99,982%, kepatuhan audit instan, dan koneksi langsung ke backbone & cloud Lintasarta.</p>',
      },
      {
        key: 'features',
        label: 'Key Features',
        body: '<ul><li>Desain Tier III Concurrent Maintainability (Uptime 99,982%)</li><li>Sistem kelistrikan redundan (Dual Power Feed, UPS N+1, Backup Generator)</li><li>Pendingin presisi (PAC N+1), keamanan biometrik 7 lapis & CCTV 24/7</li><li>Layanan Smart Handsengineer on-site 24/7</li><li>Sertifikasi lengkap: ISO 27001, ISO 9001, PCI-DSS, TVRA</li></ul>',
      },
      {
        key: 'benefits',
        label: 'Business Benefits',
        body: '<ul><li>Menghilangkan belanja modal (CAPEX) pembangunan & renovasi ruang server</li><li>Mempercepat kelulusan audit kepatuhan regulator dan klien enterprise</li><li>Memudahkan ekspansi ke Hybrid Cloud bersama Cloudeka di lokasi yang sama</li></ul>',
      },
      {
        key: 'usecase',
        label: 'Use Cases',
        body: '<ul><li>Production Data Center untuk server core banking / ERP</li><li>Disaster Recovery Center (DRC) memenuhi regulasi BCP</li><li>Hybrid Infrastructure yang menggabungkan rak fisik dengan Cloudeka</li></ul>',
      },
      {
        key: 'diff',
        label: 'Differentiator',
        body: '<p>Terintegrasi langsung dengan jaringan fiber nasional Lintasarta, ekosistem cloud lokal Cloudeka, dan SOC SQURA—memberikan satu mitra akuntabel untuk fasilitas, jaringan, dan cloud.</p>',
      },
      {
        key: 'discovery',
        label: 'Discovery Q',
        quotes: [
          ['“Kapan jadwal peremajaan perangkat UPS dan AC presisi di ruang server kantor Bapak saat ini?”', 'Tujuan: menangkap momentum penghematan CAPEX'],
          ['“Apakah ada temuan audit internal atau regulator terkait standar fisik ruang server atau ketersediaan DRC?”', 'Tujuan: menggali urgensi kepatuhan'],
          ['“Berapa jumlah rack dan kebutuhan daya (kVA) yang direncanakan untuk 2 tahun ke depan?”', 'Tujuan: kualifikasi sizing teknis'],
        ],
      },
      {
        key: 'objection',
        label: 'Objection',
        quotes: [
          ['“Ruang server di kantor kami sudah ada, jadi tidak perlu keluar biaya sewa bulanan.”', 'Respons: Bandingkan biaya sewa dengan total biaya tersembunyi (listrik PUE tinggi, peremajaan UPS/PAC ratusan juta, risiko mati listrik gedung, dan biaya gagal audit).'],
        ],
      },
      {
        key: 'crosssell',
        label: 'Cross-sell',
        body: '<ul><li><strong>Metro Ethernet</strong> untuk interkoneksi HQ ke Data Center/DRC</li><li><strong>Cloudeka</strong> untuk ekspansi kapasitas komputasi elastis</li></ul>',
      },
      {
        key: 'dodont',
        label: "Do & Don't",
        pair: [
          ['Ajak prospek melakukan kunjungan langsung (Site Visit) ke fasilitas Data Center Lintasarta', 'Menyusun estimasi harga tanpa menanyakan kebutuhan daya listrik (kVA) per rak'],
        ],
      },
    ],
  },
  {
    id: 'cloudeka',
    slug: 'cloudeka',
    name: 'Cloudeka Sovereign Cloud',
    cat: 'Cloudeka',
    group: 'Data Center & Cloud',
    desc: 'Cloud publik & privat berdaulat di Indonesia dengan tagihan Rupiah yang terprediksi, kepatuhan penuh UU PDP/OJK, dan dukungan arsitek lokal 24/7.',
    validated: 'Divalidasi Product Team · 12 Okt 2026',
    relatedCourseId: 'cloudeka',
    crossSellSlugs: ['deka-gpu', 'internet-dedicated', 'squra-managed-security'],
    roiDefaults: {
      monthlyDedicatedIdr: 42000000,
      monthlyBroadbandIdr: 58000000,
      defaultHourlyRevenueIdr: 50000000,
      defaultDowntimeHoursPerMonth: 1.5,
      slaGuaranteePct: 99.9,
    },
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        body: '<p><strong>Cloudeka</strong> adalah layanan Sovereign Cloud kelas enterprise milik Lintasarta yang di-hosting 100% di Data Center Tier III Indonesia, menyediakan Virtual Machine, Kubernetes, Object Storage, Cloud Backup, dan Disaster Recovery dengan penagihan dalam Rupiah.</p>',
      },
      {
        key: 'pain',
        label: 'Customer Pain',
        body: '<ul><li>Tagihan cloud hyperscaler asing berfluktuasi tajam karena kurs USD dan biaya data transfer keluar (egress fee) yang mahal</li><li>Kekhawatiran pelanggaran residensi data menurut UU PDP, OJK, dan aturan sektor publik</li><li>Sulit mendapatkan dukungan teknis langsung dalam Bahasa Indonesia saat terjadi insiden kritikal</li></ul>',
      },
      {
        key: 'icp',
        label: 'Ideal Customer',
        body: '<ul><li>Perusahaan yang ingin mengendalikan pembengkakan biaya cloud dolar (Cloud FinOps)</li><li>Institusi keuangan, kesehatan, BUMN, dan pemerintahan yang wajib menyimpan data di Indonesia</li><li>Perusahaan yang membutuhkan Cloud Backup & Disaster Recovery (DRaaS) cepat</li></ul>',
      },
      {
        key: 'value',
        label: 'Value Proposition',
        body: '<p>Performa cloud enterprise dengan 100% kedaulatan data di Indonesia, anggaran Rupiah yang transparan tanpa kejutan biaya egress, serta pendampingan langsung engineer lokal Lintasarta.</p>',
      },
      {
        key: 'features',
        label: 'Key Features',
        body: '<ul><li>Deka Flexi / Prime (Enterprise IaaS Compute, Block & Object Storage)</li><li>Managed Kubernetes & Container Platform siap produksi</li><li>Deka Backup & Disaster Recovery-as-a-Service (DRaaS)</li><li>100% berlokasi di Data Center Tier III Indonesia dengan tagihan IDR tetap</li></ul>',
      },
      {
        key: 'benefits',
        label: 'Business Benefits',
        body: '<ul><li>Penghematan TCO cloud hingga 25–35% dibanding hyperscaler berbiaya dolar + egress</li><li>Kepatuhan penuh terhadap UU Pelindungan Data Pribadi (UU PDP) dan regulator sektoral</li><li>Latensi akses domestik jauh lebih cepat karena terhubung langsung ke backbone Lintasarta</li></ul>',
      },
      {
        key: 'usecase',
        label: 'Use Cases',
        body: '<ul><li>Hosting aplikasi bisnis inti (ERP, e-Commerce, HRIS, Portal Pelanggan)</li><li>Cloud Backup & Disaster Recovery (DRaaS) untuk server on-premise</li><li>Modernisasi aplikasi berbasis kontainer & microservices</li></ul>',
      },
      {
        key: 'diff',
        label: 'Differentiator',
        body: '<p>Kombinasi unik kedaulatan data lokal Indonesia, penagihan Rupiah tanpa kejutan egress, bundel jaringan privat langsung (Metro/Dedicated), dan dukungan arsitek lokal dari fase asesmen hingga migrasi.</p>',
      },
      {
        key: 'discovery',
        label: 'Discovery Q',
        quotes: [
          ['“Bagaimana dampak fluktuasi kurs USD dan biaya data egress terhadap anggaran cloud bulanan Bapak tahun ini?”', 'Tujuan: membuka pain finansial cloud asing'],
          ['“Beban kerja mana yang menurut kebijakan kepatuhan perusahaan wajib disimpan dan diproses di dalam wilayah Indonesia?”', 'Tujuan: menggali kebutuhan Data Sovereignty'],
        ],
      },
      {
        key: 'objection',
        label: 'Objection',
        quotes: [
          ['“Tim kami sudah nyaman di cloud asing dan khawatir proses migrasinya rumit.”', 'Respons: Kita tidak harus memindahkan semuanya sekaligus; mulai dari beban kerja DRaaS/Backup atau 1 aplikasi dengan POC terpandu gratis bersama Cloud Architect Lintasarta.'],
        ],
      },
      {
        key: 'crosssell',
        label: 'Cross-sell',
        body: '<ul><li><strong>Deka GPU</strong> untuk beban kerja AI/LLM & analitik berat</li><li><strong>Internet Dedicated / Metro Ethernet</strong> untuk koneksi langsung berlatensi rendah</li><li><strong>SQURA</strong> untuk proteksi WAF, Anti-DDoS, dan pemantauan keamanan cloud</li></ul>',
      },
      {
        key: 'dodont',
        label: "Do & Don't",
        pair: [
          ['Tawarkan sesi asesmen TCO & POC terukur bersama tim Presales Cloudeka', 'Meminta customer memigrasikan seluruh sistem core tanpa tahapan asesmen'],
        ],
      },
    ],
  },
  {
    id: 'deka-gpu',
    slug: 'deka-gpu',
    name: 'Deka GPU (AI Cloud)',
    cat: 'Cloudeka',
    group: 'Data Center & Cloud',
    desc: 'Infrastruktur komputasi GPU NVIDIA kelas enterprise di Indonesia untuk pelatihan dan inferensi AI, LLM, Computer Vision, dan analitik data.',
    validated: 'Divalidasi Product Team · 15 Okt 2026',
    relatedCourseId: 'cloudeka',
    crossSellSlugs: ['cloudeka', 'data-center-tier-3', 'metro-ethernet'],
    roiDefaults: {
      monthlyDedicatedIdr: 85000000,
      monthlyBroadbandIdr: 120000000,
      defaultHourlyRevenueIdr: 90000000,
      defaultDowntimeHoursPerMonth: 1,
      slaGuaranteePct: 99.9,
    },
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        body: '<p><strong>Deka GPU</strong> menghadirkan klaster akselerator GPU NVIDIA berkinerja tinggi di atas ekosistem Cloudeka untuk menjalankan beban kerja Artificial Intelligence (GenAI, Private LLM, OCR, Fraud Detection, Computer Vision) dengan data tetap berada 100% di Indonesia.</p>',
      },
      {
        key: 'pain',
        label: 'Customer Pain',
        body: '<ul><li>Ingin mengimplementasikan Generative AI / Private LLM internal, tetapi dilarang mengirim data rahasia perusahaan/nasabah ke API AI publik luar negeri</li><li>Membeli server GPU fisik sendiri membutuhkan waktu inden berbulan-bulan, CAPEX miliaran, dan kebutuhan daya/pendingin tinggi</li></ul>',
      },
      {
        key: 'icp',
        label: 'Ideal Customer',
        body: '<ul><li>Perbankan, asuransi, telekomunikasi, BUMN, rumah sakit, dan universitas/lembaga riset</li><li>Perusahaan teknologi dan enterprise yang sedang membangun chatbot AI internal, e-KYC, atau deteksi anomali transaksi</li></ul>',
      },
      {
        key: 'value',
        label: 'Value Proposition',
        body: '<p>Akses instan ke superkomputer AI di Indonesia: jalankan Private LLM & analitik AI tanpa belanja CAPEX perangkat keras dan tanpa data keluar dari yurisdiksi Indonesia.</p>',
      },
      {
        key: 'features',
        label: 'Key Features',
        body: '<ul><li>Klaster GPU NVIDIA arsitektur terbaru dengan jaringan interkoneksi kecepatan tinggi</li><li>Lingkungan terisolasi penuh untuk Private LLM, RAG, dan Machine Learning</li><li>Siap diintegrasikan dengan penyimpanan objek Cloudeka & database korporat</li></ul>',
      },
      {
        key: 'benefits',
        label: 'Business Benefits',
        body: '<ul><li>Mempercepat eksperimen dan peluncuran inisiatif AI dari 6 bulan menjadi hitungan hari</li><li>Menjamin kerahasiaan data intelektual dan data pribadi nasabah (patuh UU PDP)</li><li>Skema berlangganan OPEX dalam Rupiah sesuai kapasitas GPU yang dibutuhkan</li></ul>',
      },
      {
        key: 'usecase',
        label: 'Use Cases',
        body: '<ul><li>Asisten AI internal korporasi (Enterprise RAG & Knowledge Co-Pilot)</li><li>Otomatisasi pemrosesan dokumen (OCR/e-KYC) & analisis suara Contact Center</li><li>Computer Vision untuk pengawasan kualitas pabrik & keselamatan kerja</li></ul>',
      },
      {
        key: 'diff',
        label: 'Differentiator',
        body: '<p>Penyedia GPU Cloud berdaulat pertama dan terdepan di Indonesia yang didukung ekosistem jaringan nasional dan Data Center Tier III Lintasarta.</p>',
      },
      {
        key: 'discovery',
        label: 'Discovery Q',
        quotes: [
          ['“Inisiatif AI atau otomasi cerdas apa yang masuk dalam roadmap transformasi digital perusahaan Bapak tahun ini?”', 'Tujuan: menggali proyek AI strategis'],
          ['“Bagaimana kebijakan keamanan data perusahaan Bapak terkait penggunaan layanan AI publik untuk memproses dokumen internal?”', 'Tujuan: membuka urgensi Private AI di Deka GPU'],
        ],
      },
      {
        key: 'objection',
        label: 'Objection',
        quotes: [
          ['“Kami berencana membeli server GPU fisik sendiri untuk ditaruh di kantor.”', 'Respons: Pembelian GPU fisik memerlukan CAPEX sangat besar, waktu tunggu pengiriman lama, pendinginan khusus, dan risiko cepat usang saat generasi GPU baru rilis; Deka GPU langsung siap pakai dengan model OPEX.'],
        ],
      },
      {
        key: 'crosssell',
        label: 'Cross-sell',
        body: '<ul><li><strong>Cloudeka Storage & Compute</strong> untuk pipeline data pendukung AI</li><li><strong>Metro Ethernet</strong> untuk transfer dataset privat dari HQ ke Deka GPU</li></ul>',
      },
      {
        key: 'dodont',
        label: "Do & Don't",
        pair: [
          ['Fokuskan diskusi pada use case bisnis AI (mis. e-KYC, asisten pengetahuan internal, deteksi fraud) dan keamanan data', 'Terjebak membahas spesifikasi transistor GPU tanpa mengaitkannya dengan proyek bisnis customer'],
        ],
      },
    ],
  },
  {
    id: 'squra-managed-security',
    slug: 'squra-managed-security',
    name: 'SQURA Managed Security',
    cat: 'SQURA Cybersec',
    group: 'Security & Collaboration',
    desc: 'Layanan keamanan siber terkelola penuh: SOC 24/7, Clean Pipe Anti-DDoS, Next-Gen Firewall, dan Vulnerability Assessment untuk perlindungan menyeluruh.',
    validated: 'Divalidasi Product Team · 11 Okt 2026',
    relatedCourseId: 'squra',
    crossSellSlugs: ['internet-dedicated', 'cloudeka', 'sd-wan'],
    roiDefaults: {
      monthlyDedicatedIdr: 32000000,
      monthlyBroadbandIdr: 12000000,
      defaultHourlyRevenueIdr: 75000000,
      defaultDowntimeHoursPerMonth: 2,
      slaGuaranteePct: 99.9,
    },
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        body: '<p><strong>SQURA</strong> adalah lini solusi Cybersecurity Lintasarta yang menggabungkan keahlian analis <strong>Security Operations Center (SOC) 24/7</strong>, proses tanggap insiden berstandar global, dan teknologi proteksi berlapis (Anti-DDoS, WAF, Managed Firewall, EDR, SIEM, dan VAPT).</p>',
      },
      {
        key: 'pain',
        label: 'Customer Pain',
        body: '<ul><li>Ancaman serangan ransomware, kebocoran data, dan serangan DDoS yang melumpuhkan transaksi</li><li>Sulit dan mahalnya merekrut serta mempertahankan talenta analis keamanan siber untuk berjaga 24/7</li><li>Kewajiban kepatuhan keamanan siber dari regulator (OJK, BI, BSSN, dan UU PDP)</li></ul>',
      },
      {
        key: 'icp',
        label: 'Ideal Customer',
        body: '<ul><li>Perbankan, multifinance, asuransi, BUMN, rumah sakit, e-commerce, dan instansi pemerintah</li><li>Seluruh pelanggan eksisting Internet Dedicated dan Cloudeka yang memiliki aplikasi menghadap publik</li></ul>',
      },
      {
        key: 'value',
        label: 'Value Proposition',
        body: '<p>Tidur tenang dengan penjagaan siber 24/7: deteksi dan mitigasi ancaman sebelum merusak operasional bisnis, tanpa harus membangun tim SOC internal sendiri.</p>',
      },
      {
        key: 'features',
        label: 'Key Features',
        body: '<ul><li>Managed SOC 24/7 (Monitoring, Threat Hunting, & Incident Response)</li><li>Clean Pipe Anti-DDoS langsung di hulu backbone jaringan Lintasarta</li><li>Managed Next-Gen Firewall (NGFW) & Web Application Firewall (WAF)</li><li>Vulnerability Assessment & Penetration Testing (VAPT) berkala</li></ul>',
      },
      {
        key: 'benefits',
        label: 'Business Benefits',
        body: '<ul><li>Waktu deteksi (MTTD) dan waktu respons insiden (MTTR) jauh lebih cepat</li><li>Melindungi reputasi korporat dan menghindari sanksi denda kebocoran data</li><li>Menghemat biaya rekrutmen dan lisensi tools keamanan yang terfragmentasi</li></ul>',
      },
      {
        key: 'usecase',
        label: 'Use Cases',
        body: '<ul><li>Perlindungan pipa Internet Dedicated dari serangan DDoS volumetrik</li><li>Pemantauan keamanan terpusat 24/7 untuk perbankan & perusahaan finansial</li><li>Uji ketahanan sistem (Pentest) menjelang peluncuran aplikasi baru atau audit tahunan</li></ul>',
      },
      {
        key: 'diff',
        label: 'Differentiator',
        body: '<p>Keunggulan posisi sebagai penyedia jaringan sekaligus cloud: SQURA dapat melakukan mitigasi serangan langsung di level jaringan hulu (upstream Clean Pipe) sebelum trafik jahat menyentuh router pelanggan.</p>',
      },
      {
        key: 'discovery',
        label: 'Discovery Q',
        quotes: [
          ['“Jika terjadi anomali trafik atau indikasi serangan siber pada pukul 02.00 dini hari di hari libur, siapa yang memantau dan melakukan isolasi saat ini?”', 'Tujuan: membuka kebutuhan Managed SOC 24/7'],
          ['“Kapan terakhir kali aplikasi publik Bapak menjalani Penetration Testing independen?”', 'Tujuan: pintu masuk layanan VAPT'],
        ],
      },
      {
        key: 'objection',
        label: 'Objection',
        quotes: [
          ['“Kami sudah membeli perangkat Firewall sendiri.”', 'Respons: Firewall adalah pintu gerbang yang penting, namun tanpa pemantauan analis SOC 24/7 dan proteksi Anti-DDoS di hulu jaringan, pipa internet tetap bisa penuh oleh serangan volumetrik.'],
        ],
      },
      {
        key: 'crosssell',
        label: 'Cross-sell',
        body: '<ul><li><strong>Internet Dedicated</strong> dengan bundel Clean Pipe Anti-DDoS</li><li><strong>Cloudeka</strong> dengan proteksi WAF & Cloud Workload Security</li></ul>',
      },
      {
        key: 'dodont',
        label: "Do & Don't",
        pair: [
          ['Gunakan SQURA Security Assessment Checklist untuk membantu customer memetakan celah risikonya', 'Menakut-nakuti customer tanpa menawarkan langkah asesmen yang konstruktif'],
        ],
      },
    ],
  },
  {
    id: 'microsoft-teams-rooms',
    slug: 'microsoft-teams-rooms',
    name: 'Microsoft Teams Rooms & Collaboration',
    cat: 'Collaboration',
    group: 'Security & Collaboration',
    desc: 'Solusi ruang rapat pintar hybrid terintegrasi (perangkat audio-visual tersertifikasi, lisensi, jaringan, dan dukungan terkelola) untuk kolaborasi eksekutif.',
    validated: 'Divalidasi Product Team · 09 Okt 2026',
    relatedCourseId: 'exec',
    crossSellSlugs: ['internet-dedicated', 'sd-wan'],
    roiDefaults: {
      monthlyDedicatedIdr: 15000000,
      monthlyBroadbandIdr: 8000000,
      defaultHourlyRevenueIdr: 30000000,
      defaultDowntimeHoursPerMonth: 2,
      slaGuaranteePct: 99.5,
    },
    sections: [
      {
        key: 'overview',
        label: 'Overview',
        body: '<p>Solusi <strong>Managed Modern Workplace & Microsoft Teams Rooms</strong> yang mengubah ruang rapat konvensional menjadi ruang kolaborasi hybrid berstandar direksi dengan fitur bergabung rapat 1-sentuhan (One-Touch Join), kamera AI auto-framing, dan kualitas audio jernih.</p>',
      },
      {
        key: 'pain',
        label: 'Customer Pain',
        body: '<ul><li>Waktu rapat direksi terbuang 10–15 menit di awal hanya untuk memasang kabel HDMI, mengatur mikrofon bergema, dan kamera yang tidak jelas</li><li>Peserta rapat online dari cabang merasa terabaikan karena tidak bisa melihat papan tulis atau pembicara dengan jelas</li></ul>',
      },
      {
        key: 'icp',
        label: 'Ideal Customer',
        body: '<ul><li>Perusahaan yang sudah menggunakan Microsoft 365 dan sering mengadakan rapat koordinasi antara kantor pusat dan cabang/pabrik</li><li>Korporasi yang sedang merenovasi ruang boardroom atau pindah ke gedung kantor baru</li></ul>',
      },
      {
        key: 'value',
        label: 'Value Proposition',
        body: '<p>Mulai rapat tepat waktu dalam 1 sentuhan: perangkat keras tersertifikasi, lisensi, konektivitas prioritas, dan pemeliharaan dalam satu skema layanan bulanan.</p>',
      },
      {
        key: 'features',
        label: 'Key Features',
        body: '<ul><li>Panel kontrol meja One-Touch Join terintegrasi kalender Outlook/Teams</li><li>Kamera AI Smart Framing & Speaker Tracking otomatis</li><li>Audio beamforming dengan peredam bising cerdas</li><li>Skema Managed Service lengkap dengan jaminan penggantian perangkat</li></ul>',
      },
      {
        key: 'benefits',
        label: 'Business Benefits',
        body: '<ul><li>Menghemat ratusan jam waktu produktif eksekutif setiap tahun dari kendala teknis ruang rapat</li><li>Keputusan bisnis lintas cabang diambil lebih cepat dan kolaboratif</li></ul>',
      },
      {
        key: 'usecase',
        label: 'Use Cases',
        body: '<ul><li>Executive Boardroom & Townhall Hybrid Room</li><li>Ruang koordinasi operasional harian antara HQ dan pabrik/cabang</li></ul>',
      },
      {
        key: 'diff',
        label: 'Differentiator',
        body: '<p>Didukung langsung oleh jaringan kualitas tinggi Lintasarta (QoS prioritas video conference) dan skema OPEX terkelola tanpa membebani CAPEX perangkat.</p>',
      },
      {
        key: 'discovery',
        label: 'Discovery Q',
        quotes: [
          ['“Rata-rata berapa menit waktu yang terbuang di awal rapat hybrid untuk menyiapkan kabel dan audio di ruang meeting utama Bapak?”', 'Tujuan: membuka pain produktivitas rapat'],
          ['“Apakah perusahaan Bapak sudah berlangganan ekosistem Microsoft 365 saat ini?”', 'Tujuan: kualifikasi kesiapan ekosistem'],
        ],
      },
      {
        key: 'objection',
        label: 'Objection',
        quotes: [
          ['“Kami cukup pakai laptop dan webcam biasa saja di meja rapat.”', 'Respons: Untuk rapat 1–2 orang webcam laptop cukup, tetapi untuk ruang rapat berisi 6–15 orang, peserta jarak jauh kesulitan mendengar suara di ujung meja dan kolaborasi menjadi tidak efektif.'],
        ],
      },
      {
        key: 'crosssell',
        label: 'Cross-sell',
        body: '<ul><li><strong>Internet Dedicated & SD-WAN</strong> dengan prioritas QoS untuk trafik suara & video HD</li></ul>',
      },
      {
        key: 'dodont',
        label: "Do & Don't",
        pair: [
          ['Tanyakan ukuran ruangan dan kapasitas kursi (Small, Medium, atau Large Boardroom)', 'Menjual perangkat tanpa memastikan ketersediaan koneksi internet yang stabil di ruang rapat'],
        ],
      },
    ],
  },
];

