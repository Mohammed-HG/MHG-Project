<?php
$dsn = 'sqlite:products.db';
try {
    $db = new PDO($dsn);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL
    )";
    $db->exec($query);
    
    echo "Database and table created successfully!";
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>
