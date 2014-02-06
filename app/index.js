'use strict';

//1) Download Drupal


var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    shell = require('shelljs');


var DrupalbaseGenerator = module.exports = function DrupalbaseGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DrupalbaseGenerator, yeoman.generators.Base);

DrupalbaseGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [
        {
            type: 'input',
            name: 'siteURL',
            message: 'The Site URL (e.g. 127.0.0.1/drupal or mylocalsite.co.uk)'
        },
        {
            type: 'input',
            name: 'drupalVersion',
            message: 'Enter Drupal version to download',
            default: '7.26'
        },
        {
            type: 'input',
            name: 'dbName',
            message: 'Database Name'
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'Database Username',
            default: 'root'
        },
        {
            type: 'input',
            name: 'dbPass',
            message: 'Database Password',
            default: 'root'
        }
    ];

    this.prompt(prompts, function (props) {
        this.siteURL = props.siteURL;
        this.drupalVersion = props.drupalVersion;
        this.dbName = props.dbName;
        this.dbUser = props.dbUser;
        this.dbPass = props.dbPass;

        cb();
    }.bind(this));
};

DrupalbaseGenerator.prototype.DownloadDrupal = function DownloadDrupal() {
    var cb   = this.async();

    this.log.writeln('\n***********************************************\n** Downloading the latest Version of Drupal **\n************************************************');
    this.tarball('http://ftp.drupal.org/files/projects/drupal-' + this.drupalVersion + '.zip', './', cb);
};


// Create the configuration file and grant permissions
DrupalbaseGenerator.prototype.configAndPermissions = function configAndPermissions() {

    this.log.writeln('\n***********************************************\n** Creating configuration file and granting permissions **\n************************************************');
    shell.exec('cp sites/default/default.settings.php sites/default/settings.php')
    shell.exec('chmod a+w sites/default/settings.php')
    shell.exec('chmod a+w sites/default')
};

//Create database
DrupalbaseGenerator.prototype.CreateDatabase = function CreateDatabase() {

    this.log.writeln('\n***********************\n** Creating database **\n***********************');
    shell.exec('mysql --user="' + this.dbUser + '" --password="' + this.dbPass + '" -e "create database ' + this.dbName + '"');
};