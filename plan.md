[React Frontend]
     |
     v
[S3 + CloudFront] -- HTTPS --> [Domain via Route53]

[Backend Node.js/Express]
     |
     v
[EC2 / ECS Docker Containers] -- Load Balancer
     |
     v
[MongoDB Atlas / EC2 MongoDB]
     |
     v
[S3 for product images / uploads]