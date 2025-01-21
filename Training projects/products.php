<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>المنتجات</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>منتجات الأسر المنتجة</h1>
        <nav>
            <ul>
                <li><a href="index.html">الصفحة الرئيسية</a></li>
                <li><a href="products.php">المنتجات</a></li>
                <li><a href="about.html">عن الأسر المنتجة</a></li>
                <li><a href="goals.html">الأهداف والغرض</a></li>
                <li><a href="contact.html">الاتصال</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section>
            <h2>المنتجات</h2>
            <ul>
                <?php
                $dsn = 'sqlite:products.db';
                try {
                    $db = new PDO($dsn);
                    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    
                    $query = "SELECT * FROM products";
                    $stmt = $db->query($query);
                    
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        echo "<li><a href='product.php?id=" . $row['id'] . "'>" . $row['name'] . "</a></li>";
                    }
                } catch (PDOException $e) {
                    echo 'Connection failed: ' . $e->getMessage();
                }
                ?>
            </ul>
        </section>
    </main>
    <footer>
        <p>حقوق الطبع والنشر &copy; 2025. جميع الحقوق محفوظة.</p>
    </footer>
</body>
