<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Zeuxisoo\Whoops\Provider\Slim\WhoopsMiddleware;
use Dotenv\Dotenv;
use Noodlehaus\Config;
use Lib\Yellowfin;

require __DIR__ . '/vendor/autoload.php';

// Load environment variables from .env to getenv()
try {
    $dotenv = new Dotenv(__DIR__);
    $dotenv->load();
} catch (Exception $e) {
    die('Please copy .env.example to .env file and update it.');
}

// Load all supported files
$config = new Config(__DIR__ . '/config');

// Create Slim app
$app = new \Slim\App(['settings' => $config->get('settings')]);

// Fetch DI Container
$container = $app->getContainer();

// Register Twig View helper
$container['view'] = function ($c) use ($config) {
    $view = new \Slim\Views\Twig('views', [
        'cache' => $config['views.cache']
    ]);

    // Instantiate and add Slim specific extension
    $basePath = rtrim(str_ireplace('index.php', '', $c['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new \Slim\Views\TwigExtension($c['router'], $basePath));

    return $view;
};

// DI PHP whoops error on slim framework
$app->add(new WhoopsMiddleware($app));

// Register home routing
$app->get('/', function (Request $request, Response $response, array $args) use ($config) {
    $yellowfin = $config->get('yellowfin');

    return $this->view->render($response, 'index.html', [
        'email' => $yellowfin['email'],
        'password' => $yellowfin['password'],
        'domain' => $yellowfin['domain'],
        'report_id' => $yellowfin['reportId'],
        'report_type' => $yellowfin['reportType'],
    ]);
})->setName('home');

// Register get report routing
$app->post('/get', function (Request $request, Response $response, array $args) use ($config) {
    $params = $request->getParsedBody();
    extract($params, EXTR_OVERWRITE); // Create variables $email/$password/$domain/$reportId

    // Process get report & save to local storages
    $yellowfin = new Yellowfin($email, $password, $domain);
    $filename = $yellowfin->auth()
        ->get($reportId, $type)
        ->save($type, $config->get('yellowfin.getPath'));

    return $this->view->render($response, 'get.html', [
        'report_id' => $reportId,
        'filename' => $filename,
    ]);
})->setName('get');

// Register download report routing
$app->get('/download/{filename}', function (Request $request, Response $response, array $args) use ($config) {
    $filename = $args['filename'];

    // Open file and create stream instance for response body
    $getPath = $config->get('yellowfin.getPath');
    $file = __DIR__ . "/{$getPath}/$filename";
    if (!file_exists($file)) {
        throw new Exception("[$filename] file not found on server.");
    }
    $fh = fopen($file, 'rb');
    $stream = new \Slim\Http\Stream($fh);

    return $response->withHeader('Content-Type', 'application/force-download')
        ->withHeader('Content-Type', 'application/octet-stream')
        ->withHeader('Content-Type', 'application/download')
        ->withHeader('Content-Description', 'File Transfer')
        ->withHeader('Content-Transfer-Encoding', 'binary')
        ->withHeader('Content-Disposition', 'attachment; filename="' . basename($file) . '"')
        ->withHeader('Expires', '0')
        ->withHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0')
        ->withHeader('Pragma', 'public')
        ->withBody($stream);

})->setName('download');

// Run application
$app->run();

