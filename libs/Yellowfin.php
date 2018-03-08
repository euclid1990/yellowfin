<?php

namespace Lib;

use Noodlehaus\Config;
use GuzzleHttp\Psr7\Request;
use Symfony\Component\DomCrawler\Crawler;
use GuzzleHttp\Cookie\CookieJar;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Chrome\ChromeDriver;
use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverExpectedCondition;

/**
* Yellowfin Object
*/
class Yellowfin
{
    private $email;
    private $password;
    protected $config;
    protected $domain;
    protected $client;
    protected $cookies;
    protected $token;

    public $driver;
    protected $serverUrl = 'http://localhost:4444/wd/hub';
    protected $desiredCapabilities;
    protected $connectionTimeout = 60000;
    protected $requestTimeout = 60000;
    const LOCATE_ELEMENT_TIMEOUT = 30; // second unit

    public $content;

    function __construct($email, $password, $domain)
    {
        $this->email = $email;
        $this->password = $password;
        $this->domain = $domain;
        $this->client = new \GuzzleHttp\Client();
        $this->cookies = new \GuzzleHttp\Cookie\CookieJar();
        $this->config = new Config(__DIR__ . '/../config');

        // Create Chrome desired
        $this->desiredCapabilities = new DesiredCapabilities();
        $chromeOptions = new ChromeOptions();
        $chromeOptions->addArguments(['--headless', 'window-size=1024,768', '--no-sandbox']);
        $this->desiredCapabilities->setCapability(ChromeOptions::CAPABILITY, $chromeOptions);

        /*
        // Create web driver without selenium server
        putenv("webdriver.chrome.driver=/Users/euclid/Data/Project/yellowfin/chromedriver-2.36-mac64");
        $this->driver = ChromeDriver::start();
        */

        // Start with selenium server
        $this->driver = RemoteWebDriver::create(
            $this->serverUrl,
            $this->desiredCapabilities,
            $this->connectionTimeout,
            $this->requestTimeout
        );
    }

    public function auth()
    {
        // Authenticate Yellowfin
        $this->driver->get("{$this->domain}/logon.i4");
        $inputEmail = $this->driver->findElement(WebDriverBy::name('email'));
        $inputPassword = $this->driver->findElement(WebDriverBy::name('password'));
        $buttonLogin = $this->driver->findElement(WebDriverBy::id('logonButton'));

        // Fill email
        $inputEmail->clear();
        $inputEmail->sendKeys($this->email);

        // Fill password
        $inputPassword->clear();
        $inputPassword->sendKeys($this->password);
        $buttonLogin->click();

        return $this;
    }

    public function get($reportId, $type)
    {
        // Select filter type of report on Yellowfin web page
        try {
            // Navigate to report page
            $this->driver->navigate()->to("{$this->domain}/RunReport.i4?reportUUID={$reportId}&primaryOrg=1&clientOrg=12377");
            $this->driver->wait(self::LOCATE_ELEMENT_TIMEOUT, 1000)->until(
                WebDriverExpectedCondition::visibilityOfElementLocated(WebDriverBy::cssSelector("td.toolbarButtonFirst"))
            );
            // Show export report setting
            $buttonExport = $this->driver->findElement(WebDriverBy::cssSelector("td.toolbarButtonFirst"));
            $buttonExport->click();
        } catch (Exception $e) {
            $this->driver->quit();
            throw $e;
        }

        $this->token = $this->driver->findElement(WebDriverBy::name('org.apache.struts.taglib.html.TOKEN'))->getAttribute('value');

        // Get cookies from web driver and convert to CookieJar
        $cookies = $this->driver->manage()->getCookies();
        $cookieArray = [];
        foreach ($cookies as $cookieItem) {
            array_push($cookieArray, [
                'Name'     => $cookieItem['name'],
                'Value'    => $cookieItem['value'],
                'Domain'   => $cookieItem['domain'],
                'Path'     => $cookieItem['path'],
                'Max-Age'  => null,
                'Expires'  => $cookieItem['expiry'],
                'Secure'   => $cookieItem['secure'],
                'Discard'  => false,
                'HttpOnly' => $cookieItem['httpOnly'],
            ]);
        };

        // Init new guzzle cookies from above value
        $this->cookies = new \GuzzleHttp\Cookie\CookieJar(false, $cookieArray);

        // Create required params for report export
        $formParams = $this->getParams($reportId, $type);

        // Create request to Download CSV file
        $response = $this->client->request('POST', "{$this->domain}/MIReportOutput.i4", [
            'form_params' => $formParams,
            'headers' => [
                'Connection' => 'keep-alive',
                'Cache-Control' => 'no-cache',
                'Origin' => 'http://bi.valuecommerce.com',
                'Upgrade-Insecure-Requests' => 1,
                'User-Agent' => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36",
                'Accept' => "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                'DNT' => 1,
                'Referer' => 'http://bi.valuecommerce.com/RunReport.i4?reportUUID=097239f2-6a9e-4edf-98c0-d28f003f5784&primaryOrg=1&clientOrg=12377',
                'Accept-Encoding' => 'gzip, deflate',
                'Accept-Language' => 'en-US,en;q=0.9',
            ],
            'cookies' => $this->cookies,
            'exceptions' => false
        ]);

        $this->content = $response->getBody()->getContents();

        $this->driver->quit();

        return $this;
    }

    public function getParams($reportId, $type)
    {
        // Default options
        $defaultOptions = [
            "subAction" => "",
            "annoEnd.d" => "",
            "annoEnd.m" => "",
            "annoEnd.y" => "",
            "annoFilterDisplay" => "",
            "annoFilterLink" => "",
            "annoFilterVal" => "",
            "annoLevel" => "",
            "annoRangeColour" => "",
            "annoStart.d" => "",
            "annoStart.m" => "",
            "annoStart.y" => "",
            "annoTag" => "",
            "annoTitle" => "",
            "annoValue" => "",
            "annotationAction" => "",
            "editChartId" => "",
            "editingAnno" => "0",
            "menuAction" => "",
            "newAnnoTagName" => "",
            "org.apache.struts.taglib.html.TOKEN" => $this->token,
            "searchKey" => "",
            "search|annoSearchBox|allowClientGroups" => "false",
            "search|annoSearchBox|allowRecipientReports" => "false",
            "search|annoSearchBox|includeLDAP" => "false",
            "search|annoSearchBox|includeRoles" => "false",
            "search|annoSearchBox|peopleOnly" => "false",
            "search|annoSearchBox|restrictResults" => "false",
            "search|annoSearchBox|showInactiveUsers" => "false",
            "search|annoSearchBox|showInactiveWithEmailUsers" => "false",
            "search|annoSearchBox|storyboard" => "false",
        ];

        // CSV options
        $csvOptions = [
            "action" => "btnExportCSV",
            "csvOption|ESCAPEQUOTES" => "true",
            "csvOption|QUOTECOMMAS" => "true",
            "csvOption|INCLUDEHEADINGS" => "true",
            "csvOption|CHARSET" => "UTF-8",
            "csvOption|FIELDSEPARATOR" => "COMMA",
            "csvOption|FIELDSEPARATORCHAR" => "*",
        ];

        // PDF options
        $pdfOptions = [
            "action" => "exportPdf",
            "pdfOption|PAGESIZE" => "A4",
            "pdfOption|ORIENTATION" => "PORTRAIT",
            "pdfOption|FITWIDTH" => "false",
            "pdfOption|SECURE" => "false",
            "pdfOption|SECUREPASSWORD" => "",
            "pdfOption|CJKFONT" => "",
            "pdfOption|CUSTOMMAXIMAGESIZES" => "false",
            "pdfOption|MAXWIDTH" => "",
            "pdfOption|MAXHEIGHT" => "",
            "pdfOption|CUSTOMHEADERFOOTERSIZES"=> "false",
            "pdfOption|HEADERSIZE" => "",
            "pdfOption|PAGEBREAKSECTION" => "false",
            "pdfOption|PAGEBREAKCODISPLAYS" => "false",
            "pdfOption|FOOTERSIZE"=> "",
            "pdfOption|USEDEFAULTS" => "false",
            "pdfOption|CONTENTWIDTH" => 0,
            "pdfOption|SCALETOFIT" => "false",
            "pdfOption|TABBEDCODISPLAY" => "false",
        ];

        // Get all support report types
        $reportType = $this->config->get('yellowfin.reportType');

        if ($type === $reportType['csv']) {
            return array_merge($defaultOptions, $csvOptions);
        }

        return array_merge($defaultOptions, $pdfOptions);
    }

    public function save($ext, $path, $filename = "")
    {
        $ext = strtolower($ext);

        if (empty($filename)) {
            $filename = date("Ymd_His") . ".{$ext}";
        }
        $path = rtrim($path, "/");

        // Save file to server
        file_put_contents($path . "/" . $filename, $this->content);

        return $filename;
    }
}
