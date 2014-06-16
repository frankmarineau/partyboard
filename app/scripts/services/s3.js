'use strict';

angular.module('pboardApp')
  .factory('S3', function ($http, $upload) {

    var getUploadUrl = function(file, cb) {
      $http.get('/api/s3Policy?mimeType=' + file.type).success(function(s3Params) {
        console.log(s3Params);
        cb(s3Params);
      });
    }

    return {
      uploadImage: function(file) {
        getUploadUrl(file, function(s3Params) {
          $upload.upload({
            url: 'https://partyboard.s3.amazonaws.com/',
            method: 'POST',
            data: {
              'key' : 'boardPics/'+ Math.round(Math.random()*10000) + '$$' + file.name,
              'acl' : 'public-read',
              'Content-Type' : file.type,
              'AWSAccessKeyId': s3Params.AWSAccessKeyId,
              'success_action_status' : '201',
              'Policy' : s3Params.s3Policy,
              'Signature' : s3Params.s3Signature
            },
            file: file
          }).then(function(response) {
            console.log(response);
          });
        });
      }
    }
  });