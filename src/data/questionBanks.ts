import { Question } from '../types/quiz';

export const DEFAULT_BANKS: Record<string, Question[]> = {
  'Informatika': [
    {
      id: 'inf-1',
      question: 'Perangkat lunak yang mengatur kerja perangkat keras (hardware) adalah...',
      optionA: 'Browser',
      optionB: 'Sistem Operasi (OS)',
      correctAnswer: 'B',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Sistem Operasi (Windows, macOS, Linux) mengontrol komunikasi software dan hardware.'
    },
    {
      id: 'inf-2',
      question: 'Protokol aman dan terenkripsi untuk membuka situs web adalah...',
      optionA: 'HTTPS',
      optionB: 'HTTP',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Huruf "S" pada HTTPS berarti "Secure" yang menggunakan sertifikat SSL/TLS.'
    },
    {
      id: 'inf-3',
      question: 'Bahasa markup untuk membuat kerangka dasar halaman web adalah...',
      optionA: 'HTML',
      optionB: 'Python',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'HTML (HyperText Markup Language) menyusun struktur heading, teks, tombol, dan gambar web.'
    },
    {
      id: 'inf-4',
      question: 'Perangkat keras yang berfungsi mencetak dokumen ke kertas disebut...',
      optionA: 'Scanner',
      optionB: 'Printer',
      correctAnswer: 'B',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Printer adalah output device pencetak, sedangkan scanner adalah input device pemindai.'
    },
    {
      id: 'inf-5',
      question: 'Satuan terkecil data dalam sistem komputer digital adalah...',
      optionA: 'Bit (Binary Digit)',
      optionB: 'Byte',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Sedang',
      explanation: '1 Byte terdiri dari 8 bit. Bit bernilai 0 atau 1.'
    },
    {
      id: 'inf-6',
      question: 'Kombinasi tombol keyboard untuk menyalin teks (Copy) adalah...',
      optionA: 'Ctrl + C',
      optionB: 'Ctrl + V',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Ctrl + C untuk Copy, sedangkan Ctrl + V untuk Paste.'
    },
    {
      id: 'inf-7',
      question: 'RAM pada komputer bersifat memori...',
      optionA: 'Sementara (Volatile)',
      optionB: 'Permanen (Non-volatile)',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Sedang',
      explanation: 'Data di RAM akan hilang saat komputer dimatikan.'
    },
    {
      id: 'inf-8',
      question: 'Otak utama pemrosesan data di dalam komputer adalah...',
      optionA: 'CPU (Processor)',
      optionB: 'Harddisk (Storage)',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'CPU (Central Processing Unit) mengeksekusi instruksi dan kalkulasi.'
    },
    {
      id: 'inf-9',
      question: 'Perangkat yang menghubungkan jaringan lokal (LAN) ke internet adalah...',
      optionA: 'Router',
      optionB: 'Flashdisk',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Sedang',
      explanation: 'Router bertugas mengarahkan paket data antar jaringan yang berbeda.'
    },
    {
      id: 'inf-10',
      question: 'Program jahat yang dapat merusak file atau sistem komputer disebut...',
      optionA: 'Malware / Virus',
      optionB: 'Firewall',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Firewall justru melindungi komputer dari serangan berbahaya.'
    },
    {
      id: 'inf-11',
      question: 'Komponen komputer yang berfungsi menyimpan data secara permanen adalah...',
      optionA: 'SSD / Harddisk',
      optionB: 'RAM',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'SSD dan Harddisk menyimpan file, foto, dan sistem walau komputer mati.'
    },
    {
      id: 'inf-12',
      question: 'Kombinasi tombol keyboard untuk membatalkan perintah terakhir (Undo) adalah...',
      optionA: 'Ctrl + Z',
      optionB: 'Ctrl + Y',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Ctrl + Z adalah Undo, sedangkan Ctrl + Y adalah Redo.'
    },
    {
      id: 'inf-13',
      question: 'Perangkat penunjuk cursor pada laptop selain mouse adalah...',
      optionA: 'Touchpad',
      optionB: 'Keyboard',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Touchpad peka sentuhan berfungsi menggantikan peran mouse.'
    },
    {
      id: 'inf-14',
      question: 'Format file dokumen standar portabel yang tidak mudah berubah susunannya adalah...',
      optionA: 'PDF',
      optionB: 'TXT',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'PDF (Portable Document Format) mempertahankan format tata letak dokumen.'
    },
    {
      id: 'inf-15',
      question: 'Aplikasi Google Chrome, Mozilla Firefox, dan Safari dikelompokkan sebagai...',
      optionA: 'Web Browser',
      optionB: 'Sistem Operasi',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Web browser digunakan untuk menjelajahi halaman situs di internet.'
    },
    {
      id: 'inf-16',
      question: '1 Gigabyte (GB) setara dengan sekitar berapa Megabyte (MB)?',
      optionA: '1.024 MB',
      optionB: '512 MB',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Sedang',
      explanation: 'Dalam sistem biner komputer, 1 GB = 1.024 MB.'
    },
    {
      id: 'inf-17',
      question: 'Jaringan komputer nirkabel tanpa kabel yang umum kita gunakan adalah...',
      optionA: 'Wi-Fi',
      optionB: 'Kabel UTP',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Wi-Fi memancarkan sinyal radio nirkabel untuk koneksi internet.'
    },
    {
      id: 'inf-18',
      question: 'Situs mesin pencari (search engine) paling populer di dunia adalah...',
      optionA: 'Google',
      optionB: 'Excel',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Google adalah mesin pencari web, sedangkan Excel adalah aplikasi spreadsheet.'
    },
    {
      id: 'inf-19',
      question: 'Password yang kuat dan aman sebaiknya terdiri dari...',
      optionA: 'Campuran huruf besar, kecil, angka & simbol',
      optionB: 'Tanggal lahir saja',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Kombinasi karakter kompleks mencegah akun diretas atau ditebak.'
    },
    {
      id: 'inf-20',
      question: 'Proses menyalakan ulang komputer yang sedang menyala disebut...',
      optionA: 'Restart',
      optionB: 'Shutdown',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Restart mematikan sejenak lalu menghidupkan kembali sistem.'
    },
    {
      id: 'inf-21',
      question: 'File dengan ekstensi .xlsx dibuka menggunakan aplikasi pengolah...',
      optionA: 'Angka / Spreadsheet (Excel)',
      optionB: 'Kata (Word)',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: '.xlsx adalah format dokumen Microsoft Excel / Spreadsheet.'
    },
    {
      id: 'inf-22',
      question: 'Teknologi AI kepanjangan dari...',
      optionA: 'Artificial Intelligence (Kecerdasan Buatan)',
      optionB: 'Automated Internet',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'AI adalah kecerdasan buatan pada mesin komputer.'
    },
    {
      id: 'inf-23',
      question: 'Perangkat input yang digunakan untuk memasukkan suara ke komputer adalah...',
      optionA: 'Microphone',
      optionB: 'Speaker',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Microphone adalah input perekam suara, speaker adalah output pengeras suara.'
    },
    {
      id: 'inf-24',
      question: 'Layanan penyimpanan data di server internet secara online disebut...',
      optionA: 'Cloud Storage',
      optionB: 'Disket',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Contoh cloud storage adalah Google Drive, OneDrive, dan Dropbox.'
    },
    {
      id: 'inf-25',
      question: 'Tombol keyboard untuk menghapus karakter di sebelah kiri kursor adalah...',
      optionA: 'Backspace',
      optionB: 'Delete',
      correctAnswer: 'A',
      category: 'Informatika',
      difficulty: 'Mudah',
      explanation: 'Backspace menghapus ke arah kiri, Delete menghapus ke arah kanan.'
    }
  ],

  'Matematika': [
    {
      id: 'mat-1',
      question: 'Berapakah hasil dari 7 x 8?',
      optionA: '54',
      optionB: '56',
      correctAnswer: 'B',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '7 x 8 = 56.'
    },
    {
      id: 'mat-2',
      question: 'Hasil dari 144 : 12 adalah...',
      optionA: '12',
      optionB: '14',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '12 x 12 = 144, jadi 144 : 12 = 12.'
    },
    {
      id: 'mat-3',
      question: 'Di antara angka berikut, manakah yang merupakan bilangan prima?',
      optionA: '9',
      optionB: '11',
      correctAnswer: 'B',
      category: 'Matematika',
      difficulty: 'Sedang',
      explanation: '11 hanya habis dibagi 1 dan 11, sedangkan 9 habis dibagi 3.'
    },
    {
      id: 'mat-4',
      question: 'Besar sudut satu putaran penuh lingkaran adalah...',
      optionA: '180 derajat',
      optionB: '360 derajat',
      correctAnswer: 'B',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: 'Sudut lurus = 180°, sudut satu putaran penuh = 360°.'
    },
    {
      id: 'mat-5',
      question: 'Hasil dari 15 + 27 adalah...',
      optionA: '42',
      optionB: '43',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '15 + 27 = 42.'
    },
    {
      id: 'mat-6',
      question: 'Akar kuadrat dari 81 (√81) adalah...',
      optionA: '8',
      optionB: '9',
      correctAnswer: 'B',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '9 x 9 = 81.'
    },
    {
      id: 'mat-7',
      question: 'Keliling persegi dengan panjang sisi 5 cm adalah...',
      optionA: '20 cm',
      optionB: '25 cm',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: 'Keliling = 4 x sisi = 4 x 5 cm = 20 cm.'
    },
    {
      id: 'mat-8',
      question: 'Setengah (1/2) dari 250 adalah...',
      optionA: '120',
      optionB: '125',
      correctAnswer: 'B',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '250 dibagi 2 = 125.'
    },
    {
      id: 'mat-9',
      question: 'Bentuk desimal dari pecahan 3/4 adalah...',
      optionA: '0,75',
      optionB: '0,50',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Sedang',
      explanation: '3 dibagi 4 = 0,75.'
    },
    {
      id: 'mat-10',
      question: 'Jika 3x = 21, maka nilai x adalah...',
      optionA: '6',
      optionB: '7',
      correctAnswer: 'B',
      category: 'Matematika',
      difficulty: 'Sedang',
      explanation: 'x = 21 / 3 = 7.'
    },
    {
      id: 'mat-11',
      question: 'Berapakah hasil dari 25 x 4?',
      optionA: '100',
      optionB: '125',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '25 x 4 = 100.'
    },
    {
      id: 'mat-12',
      question: 'Hasil dari 100 - 37 adalah...',
      optionA: '63',
      optionB: '73',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '100 - 37 = 63.'
    },
    {
      id: 'mat-13',
      question: 'Sudut yang besarnya tepat 90 derajat disebut sudut...',
      optionA: 'Siku-siku',
      optionB: 'Lancip',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: 'Sudut siku-siku berukuran tepat 90°.'
    },
    {
      id: 'mat-14',
      question: 'Berapakah 2 pangkat 5 (2⁵)?',
      optionA: '32',
      optionB: '64',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Sedang',
      explanation: '2 x 2 x 2 x 2 x 2 = 32.'
    },
    {
      id: 'mat-15',
      question: 'Jumlah sisi pada bangun ruang kubus ada...',
      optionA: '6 sisi',
      optionB: '8 sisi',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: 'Kubus memiliki 6 sisi datar berbentuk persegi.'
    },
    {
      id: 'mat-16',
      question: 'Nilai dari 50% dari 400 adalah...',
      optionA: '200',
      optionB: '250',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '50% adalah setengahnya, 400 / 2 = 200.'
    },
    {
      id: 'mat-17',
      question: 'Bilangan prima genap satu-satunya adalah...',
      optionA: '2',
      optionB: '4',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '2 adalah satu-satunya bilangan prima yang bernilai genap.'
    },
    {
      id: 'mat-18',
      question: 'Hasil dari 15 x 6 adalah...',
      optionA: '90',
      optionB: '80',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '15 x 6 = 90.'
    },
    {
      id: 'mat-19',
      question: 'Luas persegi panjang dengan panjang 8 cm dan lebar 5 cm adalah...',
      optionA: '40 cm²',
      optionB: '26 cm²',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: 'Luas = panjang x lebar = 8 x 5 = 40 cm².'
    },
    {
      id: 'mat-20',
      question: 'Berapakah hasil dari 9 x 9 + 9?',
      optionA: '90',
      optionB: '89',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '9 x 9 = 81; 81 + 9 = 90.'
    },
    {
      id: 'mat-21',
      question: 'Pecahan 1/2 nilainya sama besar dengan...',
      optionA: '2/4',
      optionB: '1/4',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '1/2 senilai dengan 2/4 (keduanya bernilai 0,5).'
    },
    {
      id: 'mat-22',
      question: 'Berapakah jumlah derajat seluruh sudut dalam segitiga?',
      optionA: '180 derajat',
      optionB: '360 derajat',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Sedang',
      explanation: 'Jumlah total sudut dalam segitiga selalu 180°.'
    },
    {
      id: 'mat-23',
      question: 'Hasil dari 500 : 25 adalah...',
      optionA: '20',
      optionB: '25',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Sedang',
      explanation: '500 : 25 = 20.'
    },
    {
      id: 'mat-24',
      question: 'Angka romawi dari bilangan 50 adalah...',
      optionA: 'L',
      optionB: 'C',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Sedang',
      explanation: 'L = 50, C = 100, D = 500, M = 1000.'
    },
    {
      id: 'mat-25',
      question: 'Berapakah hasil dari 12 x 12?',
      optionA: '144',
      optionB: '124',
      correctAnswer: 'A',
      category: 'Matematika',
      difficulty: 'Mudah',
      explanation: '12 x 12 = 144.'
    }
  ],

  'IPA': [
    {
      id: 'ipa-1',
      question: 'Planet yang paling dekat dengan Matahari adalah...',
      optionA: 'Merkurius',
      optionB: 'Venus',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Urutan planet terdekat: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus.'
    },
    {
      id: 'ipa-2',
      question: 'Proses tumbuhan hijau membuat makanan sendiri dengan sinar matahari disebut...',
      optionA: 'Fotosintesis',
      optionB: 'Respirasi',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Fotosintesis menghasilkan glukosa dan melepaskan gas oksigen.'
    },
    {
      id: 'ipa-3',
      question: 'Air murni membeku menjadi es pada suhu...',
      optionA: '0 derajat Celsius',
      optionB: '100 derajat Celsius',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Titik beku air adalah 0°C, sedangkan titik didih air adalah 100°C.'
    },
    {
      id: 'ipa-4',
      question: 'Alat pernapasan utama pada ikan adalah...',
      optionA: 'Paru-paru',
      optionB: 'Insang',
      correctAnswer: 'B',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Insang menyaring oksigen terlarut dalam air.'
    },
    {
      id: 'ipa-5',
      question: 'Gas yang kita hirup masuk ke dalam paru-paru saat bernapas adalah...',
      optionA: 'Oksigen (O2)',
      optionB: 'Karbon Dioksida (CO2)',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Kita menghirup oksigen dan menghembuskan karbon dioksida.'
    },
    {
      id: 'ipa-6',
      question: 'Sumber energi panas dan cahaya terbesar bagi kehidupan di Bumi adalah...',
      optionA: 'Bulan',
      optionB: 'Matahari',
      correctAnswer: 'B',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Matahari adalah bintang induk pusat tata surya kita.'
    },
    {
      id: 'ipa-7',
      question: 'Hewan yang makanan utamanya berupa tumbuhan dikelompokkan sebagai...',
      optionA: 'Herbivora',
      optionB: 'Karnivora',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Herbivora = pemakan tumbuhan, Karnivora = pemakan daging.'
    },
    {
      id: 'ipa-8',
      question: 'Perubahan wujud benda dari cair menjadi gas disebut...',
      optionA: 'Menguap',
      optionB: 'Membeku',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Contoh menguap adalah air yang direbus mendidih mengeluarkan uap.'
    },
    {
      id: 'ipa-9',
      question: 'Bagian sel darah yang bertugas membawa oksigen ke seluruh tubuh adalah...',
      optionA: 'Eritrosit (Sel Darah Merah)',
      optionB: 'Leukosit (Sel Darah Putih)',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Sedang',
      explanation: 'Hemoglobin pada eritrosit mengikat oksigen dari paru-paru.'
    },
    {
      id: 'ipa-10',
      question: 'Planet terbesar dalam tata surya kita adalah...',
      optionA: 'Jupiter',
      optionB: 'Saturnus',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Jupiter adalah planet terbesar di tata surya.'
    },
    {
      id: 'ipa-11',
      question: 'Kutub magnet yang sejenis jika didekatkan akan...',
      optionA: 'Tolak-menolak',
      optionB: 'Tarik-menarik',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Kutub senama (Utara-Utara) tolak-menolak, kutub berbeda tarik-menarik.'
    },
    {
      id: 'ipa-12',
      question: 'Benda yang dapat menghantarkan panas dan listrik dengan baik disebut...',
      optionA: 'Konduktor',
      optionB: 'Isolator',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Konduktor contohnya tembaga dan besi, isolator contohnya karet dan plastik.'
    },
    {
      id: 'ipa-13',
      question: 'Satelit alami yang mengelilingi planet Bumi adalah...',
      optionA: 'Bulan',
      optionB: 'Matahari',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Bulan adalah satu-satunya satelit alami milik Bumi.'
    },
    {
      id: 'ipa-14',
      question: 'Zat hijau daun pada tumbuhan yang menyerap cahaya matahari adalah...',
      optionA: 'Klorofil',
      optionB: 'Stomata',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Klorofil memberi warna hijau pada daun dan penting untuk fotosintesis.'
    },
    {
      id: 'ipa-15',
      question: 'Alat untuk mengukur suhu benda atau tubuh adalah...',
      optionA: 'Termometer',
      optionB: 'Barometer',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Termometer mengukur derajat suhu.'
    },
    {
      id: 'ipa-16',
      question: 'Hewan yang dapat hidup di dua alam (air dan darat) seperti katak disebut...',
      optionA: 'Amfibi',
      optionB: 'Reptil',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Katak dan salamander adalah contoh hewan amfibi.'
    },
    {
      id: 'ipa-17',
      question: 'Bunyi merambat paling cepat melalui benda berwujud...',
      optionA: 'Padat',
      optionB: 'Gas (Udara)',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Sedang',
      explanation: 'Kerapatan partikel benda padat membuat gelombang bunyi merambat paling cepat.'
    },
    {
      id: 'ipa-18',
      question: 'Lapisan udara yang melindungi Bumi dari radiasi sinar ultraviolet matahari adalah...',
      optionA: 'Lapisan Ozon',
      optionB: 'Kerak Bumi',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Sedang',
      explanation: 'Lapisan ozon (O3) di stratosfer menyaring radiasi berbahaya UV.'
    },
    {
      id: 'ipa-19',
      question: 'Organ utama manusia yang memompa darah ke seluruh tubuh adalah...',
      optionA: 'Jantung',
      optionB: 'Paru-paru',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Jantung berdetak memompa darah beroksigen.'
    },
    {
      id: 'ipa-20',
      question: 'Benda langit yang terbakar saat memasuki atmosfer Bumi dan terlihat seperti bintang jatuh adalah...',
      optionA: 'Meteor',
      optionB: 'Komet',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Sedang',
      explanation: 'Meteoroid yang terbakar di atmosfer disebut meteor.'
    },
    {
      id: 'ipa-21',
      question: 'Peristiwa pergantian siang dan malam di Bumi disebabkan oleh...',
      optionA: 'Rotasi Bumi (Bumi berputar pada porosnya)',
      optionB: 'Revolusi Bumi',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Bumi berotasi selama 24 jam mengakibatkan siang dan malam.'
    },
    {
      id: 'ipa-22',
      question: 'Hubungan saling menguntungkan antara dua makhluk hidup disebut simbiosis...',
      optionA: 'Mutualisme',
      optionB: 'Parasitisme',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Mudah',
      explanation: 'Mutualisme saling menguntungkan (contoh: lebah dan bunga).'
    },
    {
      id: 'ipa-23',
      question: 'Satuan standar internasional untuk gaya adalah...',
      optionA: 'Newton',
      optionB: 'Joule',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Sedang',
      explanation: 'Gaya diukur dalam satuan Newton (N).'
    },
    {
      id: 'ipa-24',
      question: 'Kaca pembesar (lup) memanfaatkan sifat cahaya yang dapat...',
      optionA: 'Dibiaskan',
      optionB: 'Diserap',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Sedang',
      explanation: 'Lensa cembung membiaskan cahaya sehingga objek terlihat lebih besar.'
    },
    {
      id: 'ipa-25',
      question: 'Garam dapur dalam ilmu kimia memiliki rumus senyawa...',
      optionA: 'NaCl (Natrium Klorida)',
      optionB: 'H2O (Air)',
      correctAnswer: 'A',
      category: 'Sains',
      difficulty: 'Sedang',
      explanation: 'Garam dapur adalah Natrium Klorida (NaCl).'
    }
  ],

  'Pengetahuan Umum': [
    {
      id: 'pu-1',
      question: 'Presiden pertama Republik Indonesia dan proklamator kemerdekaan adalah...',
      optionA: 'Ir. Soekarno',
      optionB: 'Drs. Moh. Hatta',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Ir. Soekarno adalah presiden pertama RI dan Moh. Hatta adalah wakil presiden pertama.'
    },
    {
      id: 'pu-2',
      question: 'Hari Kemerdekaan Republik Indonesia diperingati setiap tanggal...',
      optionA: '17 Agustus',
      optionB: '28 Oktober',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Indonesia merdeka pada 17 Agustus 1945.'
    },
    {
      id: 'pu-3',
      question: 'Lambang sila pertama Pancasila, "Ketuhanan Yang Maha Esa", adalah...',
      optionA: 'Bintang Emas',
      optionB: 'Rantai Baja',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Sila ke-1: Bintang, Sila ke-2: Rantai, Sila ke-3: Pohon Beringin.'
    },
    {
      id: 'pu-4',
      question: 'Hewan langka endemik purba khas Nusa Tenggara Timur adalah...',
      optionA: 'Komodo',
      optionB: 'Orangutan',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Kadal raksasa Komodo hidup alami di Pulau Komodo dan Rinca.'
    },
    {
      id: 'pu-5',
      question: 'Samudra terluas dan terdalam di permukaan bumi adalah...',
      optionA: 'Samudra Pasifik',
      optionB: 'Samudra Hindia',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Sedang',
      explanation: 'Samudra Pasifik mencakup lebih dari 30% permukaan bumi.'
    },
    {
      id: 'pu-6',
      question: 'Candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah adalah...',
      optionA: 'Candi Borobudur',
      optionB: 'Candi Prambanan',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Borobudur adalah candi Buddha, sedangkan Prambanan adalah candi Hindu.'
    },
    {
      id: 'pu-7',
      question: 'Lagu kebangsaan resmi negara Republik Indonesia adalah...',
      optionA: 'Indonesia Raya',
      optionB: 'Garuda Pancasila',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Diciptakan oleh Wage Rudolf Soepratman.'
    },
    {
      id: 'pu-8',
      question: 'Benua terkecil di dunia berdasarkan luas daratan adalah...',
      optionA: 'Benua Australia',
      optionB: 'Benua Eropa',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Sedang',
      explanation: 'Benua Australia adalah benua terkecil di bumi.'
    },
    {
      id: 'pu-9',
      question: 'Gunung tertinggi di dunia yang berada di pegunungan Himalaya adalah...',
      optionA: 'Gunung Everest',
      optionB: 'Gunung Kilimanjaro',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Gunung Everest memiliki ketinggian 8.848 meter di atas permukaan laut.'
    },
    {
      id: 'pu-10',
      question: 'Mata uang resmi yang digunakan di negara Jepang adalah...',
      optionA: 'Yen',
      optionB: 'Won',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Yen adalah mata uang Jepang, sedangkan Won adalah mata uang Korea Selatan.'
    },
    {
      id: 'pu-11',
      question: 'Ibu kota negara Malaysia adalah...',
      optionA: 'Kuala Lumpur',
      optionB: 'Bangkok',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Kuala Lumpur adalah ibu kota Malaysia.'
    },
    {
      id: 'pu-12',
      question: 'Hari Sumpah Pemuda diperingati setiap tanggal...',
      optionA: '28 Oktober',
      optionB: '10 November',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Sumpah Pemuda diikrarkan pada 28 Oktober 1928.'
    },
    {
      id: 'pu-13',
      question: 'Hari Pahlawan Nasional di Indonesia jatuh pada tanggal...',
      optionA: '10 November',
      optionB: '1 Mei',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: '10 November memperingati pertempuran Surabaya tahun 1945.'
    },
    {
      id: 'pu-14',
      question: 'Alat musik tradisional petik dari Nusa Tenggara Timur adalah...',
      optionA: 'Sasando',
      optionB: 'Angklung',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Sasando dibuat dari daun lontar dan dawai khas Pulau Rote.'
    },
    {
      id: 'pu-15',
      question: 'Semboyan bangsa Indonesia "Bhinneka Tunggal Ika" memiliki arti...',
      optionA: 'Berbeda-beda tetapi tetap satu',
      optionB: 'Bersatu kita teguh',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Berasal dari kitab Sutasoma karangan Mpu Tantular.'
    },
    {
      id: 'pu-16',
      question: 'Danau vulkanik terbesar di Indonesia yang berada di Sumatera Utara adalah...',
      optionA: 'Danau Toba',
      optionB: 'Danau Singkarak',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Danau Toba memiliki pulau Samosir di bagian tengahnya.'
    },
    {
      id: 'pu-17',
      question: 'Monumen Nasional (Monas) terletak di kota...',
      optionA: 'Jakarta',
      optionB: 'Surabaya',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Monas berdiri di Lapangan Medan Merdeka, Jakarta Pusat.'
    },
    {
      id: 'pu-18',
      question: 'Warna bendera nasional Indonesia adalah...',
      optionA: 'Merah dan Putih',
      optionB: 'Merah dan Biru',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Merah berarti berani dan putih berarti suci.'
    },
    {
      id: 'pu-19',
      question: 'Berapakah jumlah provinsi di pulau Jawa (termasuk DKI Jakarta dan DI Yogyakarta)?',
      optionA: '6 Provinsi',
      optionB: '4 Provinsi',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Sedang',
      explanation: 'Banten, DKI Jakarta, Jawa Barat, Jawa Tengah, DI Yogyakarta, Jawa Timur.'
    },
    {
      id: 'pu-20',
      question: 'Gurun pasir terluas dan terpanas di dunia adalah...',
      optionA: 'Gurun Sahara',
      optionB: 'Gurun Gobi',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Gurun Sahara membentang di bagian utara benua Afrika.'
    },
    {
      id: 'pu-21',
      question: 'Pahlawan nasional wanita pencetus emansipasi wanita di Indonesia adalah...',
      optionA: 'R.A. Kartini',
      optionB: 'Cut Nyak Dien',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Hari Kartini diperingati setiap tanggal 21 April.'
    },
    {
      id: 'pu-22',
      question: 'Kain tradisional khas Indonesia yang diakui UNESCO sebagai warisan budaya dunia adalah...',
      optionA: 'Batik',
      optionB: 'Kimono',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Hari Batik Nasional diperingati setiap 2 Oktober.'
    },
    {
      id: 'pu-23',
      question: 'Gedung pencakar langit tertinggi di dunia saat ini berada di Dubai, yaitu...',
      optionA: 'Burj Khalifa',
      optionB: 'Menara Eiffel',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Burj Khalifa memiliki tinggi mencapai 828 meter.'
    },
    {
      id: 'pu-24',
      question: 'Alat musik tradisional dari bambu khas Jawa Barat yang digoyangkan adalah...',
      optionA: 'Angklung',
      optionB: 'Gamelan',
      correctAnswer: 'A',
      category: 'Pengetahuan Umum',
      difficulty: 'Mudah',
      explanation: 'Angklung menghasilkan bunyi saat digoyang-goyangkan.'
    },
    {
      id: 'pu-25',
      question: 'Rumah adat khas suku Minangkabau di Sumatera Barat disebut...',
      optionA: 'Rumah Gadang',
      optionB: 'Rumah Joglo',
      correctAnswer: 'A',
      category: 'Umum',
      difficulty: 'Mudah',
      explanation: 'Rumah Gadang memiliki atap lancip menyerupai tanduk kerbau.'
    }
  ],

  'Bahasa': [
    {
      id: 'bah-1',
      question: 'Antonim atau lawan kata dari kata "Optimis" adalah...',
      optionA: 'Pesimis',
      optionB: 'Realistis',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Optimis berpandangan baik/penuh harapan, lawannya pesimis berpandangan ragu/buruk.'
    },
    {
      id: 'bah-2',
      question: 'Sinonim atau persamaan makna dari kata "Adaptasi" adalah...',
      optionA: 'Penyesuaian',
      optionB: 'Pemisahan',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Adaptasi berarti penyesuaian diri terhadap kondisi lingkungan.'
    },
    {
      id: 'bah-3',
      question: 'Penulisan kata serapan baku dalam bahasa Indonesia yang tepat adalah...',
      optionA: 'Aktivitas',
      optionB: 'Aktifitas',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Kata baku yang tepat menurut KBBI adalah "aktivitas" (dengan v).'
    },
    {
      id: 'bah-4',
      question: 'Peribahasa "Air beriak tanda tak dalam" bermakna bahwa seseorang yang...',
      optionA: 'Banyak bicara biasanya kurang ilmunya',
      optionB: 'Pendiam selalu menyimpan dendam',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Orang yang sombong banyak bicara hakikatnya pengetahuannya dangkal.'
    },
    {
      id: 'bah-5',
      question: 'Majas yang mengumpamakan benda mati seolah-olah bernyawa dan berperilaku seperti manusia adalah...',
      optionA: 'Personifikasi',
      optionB: 'Metafora',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Sedang',
      explanation: 'Contoh personifikasi: "Angin malam memeluk erat tubuhku".'
    },
    {
      id: 'bah-6',
      question: 'Kalimat yang tersusun secara runut, padat, nalar dan hemat kata disebut kalimat...',
      optionA: 'Efektif',
      optionB: 'Ambigu',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Kalimat efektif menyampaikan gagasan penulis/pembicara dengan jelas tanpa berbelit-belit.'
    },
    {
      id: 'bah-7',
      question: 'Tanda baca titik dua (:) dalam penulisan kalimat digunakan untuk...',
      optionA: 'Pemerincian daftar penjelasan',
      optionB: 'Mengakhiri kalimat tanya',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Tanda titik dua dipakai pada akhir suatu pernyataan lengkap yang diikuti pemerincian.'
    },
    {
      id: 'bah-8',
      question: 'Karya puisi lama Melayu yang tiap bait terdiri atas 4 baris bersajak a-b-a-b disebut...',
      optionA: 'Pantun',
      optionB: 'Gurindam',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Pantun memiliki sampiran pada baris 1-2 dan isi pada baris 3-4.'
    },
    {
      id: 'bah-9',
      question: 'Kata penghubung seperti "dan", "atau", dan "serta" termasuk ke dalam konjungsi...',
      optionA: 'Koordinatif (setara)',
      optionB: 'Subordinatif (bertingkat)',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Sedang',
      explanation: 'Konjungsi koordinatif menghubungkan dua unsur gramatikal yang setara kedudukannya.'
    },
    {
      id: 'bah-10',
      question: 'Cerita rakyat atau dongeng yang tokoh-tokoh utamanya adalah binatang yang bersikap seperti manusia disebut...',
      optionA: 'Fabel',
      optionB: 'Mite',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Fabel mengisahkan moralitas melalui perumpamaan tingkah laku satwa.'
    },
    {
      id: 'bah-11',
      question: 'Tokoh utama yang berwatak baik dan membela kebenaran dalam suatu cerita disebut...',
      optionA: 'Protagonis',
      optionB: 'Antagonis',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Protagonis adalah tokoh utama yang bernilai positif/baik.'
    },
    {
      id: 'bah-12',
      question: 'Tokoh penentang tokoh utama yang umumnya berwatak jahat atau menyulitkan cerita disebut...',
      optionA: 'Antagonis',
      optionB: 'Tritagonis',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Antagonis adalah lawan atau penentang utama sang protagonis.'
    },
    {
      id: 'bah-13',
      question: 'Peribahasa "Besar pasak daripada tiang" menggambarkan situasi...',
      optionA: 'Pengeluaran lebih besar daripada pendapatan',
      optionB: 'Orang yang sangat cermat dan hemat',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Bermakna belanja pengeluaran melebihi kemampuan penghasilan.'
    },
    {
      id: 'bah-14',
      question: 'Kata "Kolektif" memiliki arti...',
      optionA: 'Secara bersama-sama / gabungan',
      optionB: 'Sendiri-sendiri / perseorangan',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Kolektif berarti dilakukan atau dimiliki secara bersama oleh suatu kelompok.'
    },
    {
      id: 'bah-15',
      question: 'Penulisan kata baku yang benar untuk tempat pelayanan kesehatan dokter adalah...',
      optionA: 'Praktik',
      optionB: 'Praktek',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Dalam KBBI, bentuk baku yang benar adalah "praktik", bukan "praktek".'
    },
    {
      id: 'bah-16',
      question: 'Sudut pandang orang pertama dalam karya sastra cerita fiksi ditandai oleh kata ganti...',
      optionA: 'Aku / Saya',
      optionB: 'Dia / Mereka',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Orang pertama menempatkan pencerita sebagai pelaku ("aku" atau "kami").'
    },
    {
      id: 'bah-17',
      question: 'Kalimat ajakan atau instruksi dalam teks prosedur menggunakan kata kerja bernada...',
      optionA: 'Imperatif (perintah/arahan)',
      optionB: 'Interogatif (pertanyaan)',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Sedang',
      explanation: 'Kalimat imperatif berisi perintah, imbauan, atau petunjuk tindakan.'
    },
    {
      id: 'bah-18',
      question: '"Senyumannya manis laksana gula madu" merupakan contoh penggunaan gaya bahasa...',
      optionA: 'Simile / Asosiasi',
      optionB: 'Litotes',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Sedang',
      explanation: 'Simile membandingkan dua hal eksplisit dengan kata "laksana", "bagai", atau "seperti".'
    },
    {
      id: 'bah-19',
      question: 'Antonim atau lawan makna dari kata "Kacau" adalah...',
      optionA: 'Tertib / Teratur',
      optionB: 'Berantakan',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'Tertib dan teratur adalah kebalikan dari kondisi kacau.'
    },
    {
      id: 'bah-20',
      question: 'Singkatan dari Kamus Besar Bahasa Indonesia adalah...',
      optionA: 'KBBI',
      optionB: 'EYD',
      correctAnswer: 'A',
      category: 'Bahasa',
      difficulty: 'Mudah',
      explanation: 'KBBI adalah rujukan utama kosakata baku bahasa Indonesia.'
    }
  ],

  'Seni': [
    {
      id: 'sen-1',
      question: 'Warna primer (warna pokok yang tidak dapat dihasilkan dari campuran warna lain) adalah...',
      optionA: 'Merah, Kuning, Biru',
      optionB: 'Hijau, Oranye, Ungu',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Merah, Kuning, dan Biru adalah warna primer pigmen.'
    },
    {
      id: 'sen-2',
      question: 'Pencampuran warna merah dan kuning akan menghasilkan warna sekunder...',
      optionA: 'Oranye (Jingga)',
      optionB: 'Hijau',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Merah + Kuning = Oranye / Jingga.'
    },
    {
      id: 'sen-3',
      question: 'Pencampuran warna biru dan kuning akan menghasilkan warna...',
      optionA: 'Hijau',
      optionB: 'Ungu',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Biru + Kuning = Hijau.'
    },
    {
      id: 'sen-4',
      question: 'Pencampuran warna merah dan biru akan menghasilkan warna...',
      optionA: 'Ungu',
      optionB: 'Cokelat',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Merah + Biru = Ungu.'
    },
    {
      id: 'sen-5',
      question: 'Alat musik tradisional berbahan bambu khas Jawa Barat yang dibunyikan dengan digoyangkan adalah...',
      optionA: 'Angklung',
      optionB: 'Kolintang',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Angklung telah diakui UNESCO sebagai warisan budaya tak benda.'
    },
    {
      id: 'sen-6',
      question: 'Seni melipat kertas indah tradisional yang berasal dari Jepang disebut...',
      optionA: 'Origami',
      optionB: 'Kaligrafi',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Origami adalah seni tradisional Jepang melipat kertas menjadi aneka bentuk.'
    },
    {
      id: 'sen-7',
      question: 'Karya seni rupa patung memiliki ukuran panjang, lebar, dan ruang volume, sehingga termasuk karya seni...',
      optionA: 'Tiga Dimensi (3D)',
      optionB: 'Dua Dimensi (2D)',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Karya 3 dimensi memiliki volume dan dapat dinikmati dari berbagai sudut.'
    },
    {
      id: 'sen-8',
      question: 'Tari Saman yang terkenal dengan gerakan tepuk tangan dan dada serempak berasal dari daerah...',
      optionA: 'Aceh (Suku Gayo)',
      optionB: 'Bali',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Tari Saman berasal dari dataran tinggi Gayo, Aceh.'
    },
    {
      id: 'sen-9',
      question: 'Tari Kecak yang diiringi seruan paduan suara vokal melingkar "cak-cak-cak" berasal dari...',
      optionA: 'Bali',
      optionB: 'Nusa Tenggara Barat',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Tari Kecak menceritakan epik Ramayana diiringi paduan suara penari melingkar.'
    },
    {
      id: 'sen-10',
      question: 'Lukisan atau gambar yang melebih-lebihkan ciri khas fisik tokoh untuk memberi kesan humoris disebut...',
      optionA: 'Karikatur',
      optionB: 'Realis',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Karikatur menampilkan distorsi proporsi tubuh demi efek sindiran atau lelucon.'
    },
    {
      id: 'sen-11',
      question: 'Alat canting dalam seni rupa tradisional digunakan untuk...',
      optionA: 'Menorehkan cairan lilin malam pada kain batik',
      optionB: 'Memahat kayu dan batu relief',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Canting adalah canting tembaga penampung lilin panas pembatik.'
    },
    {
      id: 'sen-12',
      question: 'Kolase adalah karya seni rupa dua dimensi yang dibuat dengan teknik...',
      optionA: 'Menempelkan potongan berbagai bahan / kertas',
      optionB: 'Menyemprotkan cat air di atas kanvas',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Kolase menggabungkan tempelan bahan-bahan berbeda menjadi kesatuan gambar.'
    },
    {
      id: 'sen-13',
      question: 'Tari Piring yang dibawakan penari sambil mengayunkan piring di telapak tangan berasal dari...',
      optionA: 'Sumatera Barat (Minangkabau)',
      optionB: 'Kalimantan Selatan',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Tari Piring merupakan tarian tradisional Minangkabau.'
    },
    {
      id: 'sen-14',
      question: 'Tempo lagu yang berjalan dengan tempo tenang dan lambat dalam musik disebut tempo...',
      optionA: 'Andante / Adagio',
      optionB: 'Presto / Allegro',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Sedang',
      explanation: 'Adagio/Andante adalah tempo lambat santai, sedangkan Allegro adalah tempo riang cepat.'
    },
    {
      id: 'sen-15',
      question: 'Susunan tangga nada dasar (do - re - mi - fa - sol - la - si - do) dalam musik disebut tangga nada...',
      optionA: 'Diatonik',
      optionB: 'Pentatonik',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Sedang',
      explanation: 'Tangga nada diatonik memiliki 7 nada pokok dengan jarak interval satu dan setengah.'
    },
    {
      id: 'sen-16',
      question: 'Lagu daerah "Yamko Rambe Yamko" dan "Apuse" berasal dari wilayah...',
      optionA: 'Papua',
      optionB: 'Sulawesi Utara',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Kedua lagu legendaris tersebut berasal dari tanah Papua.'
    },
    {
      id: 'sen-17',
      question: 'Wayang Kulit tradisional Jawa dibuat dari bahan baku utama...',
      optionA: 'Kulit kerbau / sapi yang dikeringkan',
      optionB: 'Karton tebal berlaminasi',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Kulit kerbau yang ditatah rapi dan disungging memberi daya tahan berabad-abad.'
    },
    {
      id: 'sen-18',
      question: 'Gamelan tradisional Jawa dan Bali sebagian besar instrumennya terbuat dari paduan logam...',
      optionA: 'Perunggu atau kuningan',
      optionB: 'Alumunium ringan',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Perunggu menghasilkan dengung bunyi gong dan saron yang paling merdu.'
    },
    {
      id: 'sen-19',
      question: 'Alat musik petik tradisional Sasando dengan wadah resonansi daun lontar berasal dari...',
      optionA: 'Pulau Rote, Nusa Tenggara Timur',
      optionB: 'Pulau Madura, Jawa Timur',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Sasando diciptakan oleh masyarakat Pulau Rote, NTT.'
    },
    {
      id: 'sen-20',
      question: 'Karya seni rupa dua dimensi (2D) seperti lukisan dan poster hanya memiliki dimensi...',
      optionA: 'Panjang dan Lebar (bidang datar)',
      optionB: 'Panjang, Lebar, dan Ketebalan Ruang',
      correctAnswer: 'A',
      category: 'Seni',
      difficulty: 'Mudah',
      explanation: 'Seni 2D berada di permukaan bidang datar tanpa kedalaman fisik.'
    }
  ],

  'Pythagoras': [
    {
      id: 'pyt-1',
      question: 'Siapakah tokoh pelopor utama yang mencetuskan rumus Teorema Pythagoras?',
      optionA: 'Pythagoras dari Samos (Filsuf Yunani)',
      optionB: 'Archimedes dari Sirakusa',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Pythagoras adalah filsuf dan matematikawan Yunani Kuno (sekitar 570–495 SM) dari Pulau Samos.'
    },
    {
      id: 'pyt-2',
      question: 'Teorema Pythagoras berlaku khusus untuk bangun datar jenis apa?',
      optionA: 'Segitiga Siku-Siku (Sudut 90°)',
      optionB: 'Segitiga Sama Sisi',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Teorema Pythagoras secara mendasar hanya berlaku pada segitiga yang memiliki sudut siku-siku 90 derajat.'
    },
    {
      id: 'pyt-3',
      question: 'Sisi terpanjang yang berada tepat di hadapan sudut siku-siku disebut...',
      optionA: 'Hipotenusa (Sisi Miring)',
      optionB: 'Garis Tinggi',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Hipotenusa adalah sisi miring dan merupakan sisi terpanjang pada segitiga siku-siku.'
    },
    {
      id: 'pyt-4',
      question: 'Rumus utama Teorema Pythagoras jika c adalah sisi miring dan a, b adalah sisi tegak adalah...',
      optionA: 'c² = a² + b²',
      optionB: 'c = a + b',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Kuadrat sisi miring sama dengan jumlah kuadrat dari kedua sisi tegak segitiga siku-siku (c² = a² + b²).'
    },
    {
      id: 'pyt-5',
      question: 'Bagaimana rumus mencari sisi tegak (a) jika diketahui sisi miring (c) dan sisi tegak lain (b)?',
      optionA: 'a² = c² − b²',
      optionB: 'a² = c² + b²',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Untuk mencari sisi tegak, kuadrat sisi miring dikurangi kuadrat sisi lainnya: a = √(c² - b²).'
    },
    {
      id: 'pyt-6',
      question: 'Jika sisi tegak sebuah segitiga siku-siku adalah 3 cm dan 4 cm, berapakah panjang sisi miringnya?',
      optionA: '5 cm',
      optionB: '7 cm',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'c = √(3² + 4²) = √(9 + 16) = √25 = 5 cm.'
    },
    {
      id: 'pyt-7',
      question: 'Jika sisi tegak adalah 5 cm dan 12 cm, berapakah panjang sisi miringnya?',
      optionA: '13 cm',
      optionB: '17 cm',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'c = √(5² + 12²) = √(25 + 144) = √169 = 13 cm.'
    },
    {
      id: 'pyt-8',
      question: 'Apa yang dimaksud dengan Triple Pythagoras?',
      optionA: 'Tiga bilangan asli yang tepat memenuhi rumus Pythagoras a² + b² = c²',
      optionB: 'Segitiga yang memiliki tiga sudut lancip sama besar',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Triple Pythagoras adalah kelompok 3 bilangan bulat positif yang memenuhi kuadrat sisi miring sama dengan jumlah kuadrat sisi tegak.'
    },
    {
      id: 'pyt-9',
      question: 'Manakah kelompok angka berikut yang merupakan Triple Pythagoras?',
      optionA: '3, 4, dan 5',
      optionB: '3, 4, dan 6',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: '3² + 4² = 9 + 16 = 25 = 5². Sedangkan 3² + 4² ≠ 6².'
    },
    {
      id: 'pyt-10',
      question: 'Apakah kelipatan bilangan dari Triple Pythagoras (misal 6, 8, 10 dari 3, 4, 5) juga merupakan Triple Pythagoras?',
      optionA: 'Benar (Kelipatan selalu membentuk segitiga siku-siku)',
      optionB: 'Salah (Hanya berlaku untuk bilangan ganjil)',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Setiap pengali k pada triple (ka, kb, kc) pasti memenuhi persamaan Pythagoras (contoh: 6² + 8² = 36 + 64 = 100 = 10²).'
    },
    {
      id: 'pyt-11',
      question: 'Sebuah tiang diikat tali 17 m ke patok tanah berjarak 8 m dari kaki tiang. Berapakah tinggi tiang?',
      optionA: '15 meter',
      optionB: '12 meter',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Sedang',
      explanation: 'Tinggi = √(17² − 8²) = √(289 − 64) = √225 = 15 meter.'
    },
    {
      id: 'pyt-12',
      question: 'Dalam kehidupan nyata, Teorema Pythagoras banyak berkaitan dengan bidang apa saja?',
      optionA: 'Arsitektur bangunan, navigasi arah kapal, dan jembatan kabel pancang',
      optionB: 'Tata bahasa sastra dan seni musik vokal saja',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Pythagoras diaplikasikan untuk mengukur kesikuan pondasi bangunan, jarak kapal/pesawat, kabel jembatan, dan diagonal layar.'
    },
    {
      id: 'pyt-13',
      question: 'Pada jembatan kabel pancang (seperti Jembatan Teluk Hangzhou), kabel pancang bertindak sebagai...',
      optionA: 'Sisi miring (Hipotenusa) dari segitiga siku-siku',
      optionB: 'Sisi alas jalan mendatar',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Tiang tegak adalah sisi tegak, jalan adalah alas, dan kabel baja pancang adalah hipotenusa.'
    },
    {
      id: 'pyt-14',
      question: 'Apakah dua diagonal tegak lurus pada bangun layang-layang memenuhi unsur Teorema Pythagoras?',
      optionA: 'Ya, kedua diagonal membagi layang-layang menjadi 4 segitiga siku-siku',
      optionB: 'Tidak, karena layang-layang bukan bangun segitiga',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Karena kedua diagonal berpotongan tegak lurus (90°), sisi layang-layang dapat dihitung menggunakan Pythagoras.'
    },
    {
      id: 'pyt-15',
      question: 'Persegi panjang berukuran panjang 12 cm dan lebar 5 cm. Berapakah panjang garis diagonalnya?',
      optionA: '13 cm',
      optionB: '17 cm',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Diagonal = √(12² + 5²) = √(144 + 25) = √169 = 13 cm.'
    },
    {
      id: 'pyt-16',
      question: 'Kebalikan Teorema Pythagoras: Jika pada segitiga berlaku c² > a² + b² (kuadrat sisi terpanjang lebih besar), maka segitiga tersebut adalah...',
      optionA: 'Segitiga Tumpul',
      optionB: 'Segitiga Lancip',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Sedang',
      explanation: 'Jika c² = a² + b² maka siku-siku; jika c² > a² + b² maka segitiga tumpul; jika c² < a² + b² maka segitiga lancip.'
    },
    {
      id: 'pyt-17',
      question: 'Segitiga dengan panjang sisi 7 cm, 24 cm, dan 25 cm apakah merupakan segitiga siku-siku?',
      optionA: 'Benar (7² + 24² = 49 + 576 = 625 = 25²)',
      optionB: 'Salah (Bukan segitiga siku-siku)',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: '7, 24, 25 adalah salah satu Triple Pythagoras pokok sehingga pasti membentuk sudut siku-siku 90°.'
    },
    {
      id: 'pyt-18',
      question: 'Berapakah panjang sisi BC jika diketahui segitiga siku-siku ABC dengan AB = 15 cm dan AC = 12 cm (siku-siku di C)?',
      optionA: '9 cm',
      optionB: '11 cm',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Sedang',
      explanation: 'BC = √(15² − 12²) = √(225 − 144) = √81 = 9 cm.'
    },
    {
      id: 'pyt-19',
      question: 'Rumus aljabar untuk merumuskan Triple Pythagoras dari bilangan m dan n (m > n) adalah...',
      optionA: 'a = m² − n², b = 2mn, dan c = m² + n²',
      optionB: 'a = m + n, b = m − n, dan c = m × n',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Sedang',
      explanation: 'Rumus Euclid: sisi siku-siku 1 = m² - n², sisi siku-siku 2 = 2mn, dan hipotenusa = m² + n².'
    },
    {
      id: 'pyt-20',
      question: 'Sebuah persegi panjang memiliki diagonal 14,5 cm dan panjang 10,5 cm. Berapakah lebarnya?',
      optionA: '10 cm',
      optionB: '8 cm',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Sedang',
      explanation: 'Lebar = √(14,5² − 10,5²) = √(210,25 − 110,25) = √100 = 10 cm.'
    },
    {
      id: 'pyt-21',
      question: 'Pada pembuktian geometri Pythagoras, luas persegi pada sisi miring sama dengan...',
      optionA: 'Jumlah luas persegi pada kedua sisi tegaknya',
      optionB: 'Dua kali luas keliling segitiga',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Luas persegi sisi c (c²) sama persis dengan penjumlahan luas persegi sisi a (a²) dan sisi b (b²).'
    },
    {
      id: 'pyt-22',
      question: 'Manakah dari pasangan angka berikut yang BUKAN merupakan Triple Pythagoras?',
      optionA: '4, 5, 6',
      optionB: '8, 15, 17',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: '4² + 5² = 16 + 25 = 41 ≠ 36 (6²). Sedangkan 8² + 15² = 64 + 225 = 289 = 17² (Triple).'
    },
    {
      id: 'pyt-23',
      question: 'Kapal berlayar ke arah barat sejauh 9 km, lalu berbelok ke arah utara sejauh 12 km. Jarak terpendek kapal dari titik awal adalah...',
      optionA: '15 km',
      optionB: '21 km',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Jarak = √(9² + 12²) = √(81 + 144) = √225 = 15 km.'
    },
    {
      id: 'pyt-24',
      question: 'Pada trapesium siku-siku, Teorema Pythagoras dapat digunakan untuk mencari panjang sisi miring dengan bantuan...',
      optionA: 'Garis tinggi yang ditarik tegak lurus ke sisi alas',
      optionB: 'Sudut luar lingkaran',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Garis tinggi memotong trapesium menjadi persegi panjang dan segitiga siku-siku, sehingga sisi miring dapat dihitung.'
    },
    {
      id: 'pyt-25',
      question: 'Segitiga siku-siku memiliki hipotenusa 26 cm dan salah satu sisi siku-siku 24 cm. Panjang sisi lainnya adalah...',
      optionA: '10 cm',
      optionB: '12 cm',
      correctAnswer: 'A',
      category: 'Pythagoras',
      difficulty: 'Mudah',
      explanation: 'Sisi = √(26² − 24²) = √(676 − 576) = √100 = 10 cm.'
    }
  ]
};

// Also expose 'Sains' as an alias/duplicate of 'IPA' in DEFAULT_BANKS for direct topic selection
DEFAULT_BANKS['Sains'] = DEFAULT_BANKS['IPA'];

export const STANDARD_CATEGORIES = [
  'Semua',
  'Pythagoras',
  'Matematika',
  'Sains',
  'Bahasa',
  'Seni',
  'Informatika',
  'Umum',
] as const;

export type StandardCategory = typeof STANDARD_CATEGORIES[number];

export const TIME_OPTIONS = [5, 10, 15, 20, 30, 45, 60];
export const GRADE_OPTIONS = ['Semua Kelas', 'Kelas 1-3 SD', 'Kelas 4-6 SD', 'Kelas 7-9 SMP', 'Kelas 10-12 SMA', 'Kuliah / Umum'];

