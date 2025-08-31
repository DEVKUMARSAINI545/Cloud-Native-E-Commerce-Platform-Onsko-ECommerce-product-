# 1️⃣ Create S3 Bucket
resource "aws_s3_bucket" "frontend" {
  bucket = "aws-bucket-12555"  # Replace with your bucket name
  tags = {
    Name = "Frontend Bucket"
  }
}

# 2️⃣ Enable Public Website Hosting (index + error document)
resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# 3️⃣ Allow Terraform to put bucket policy (without ACLs)
resource "aws_s3_bucket_public_access_block" "frontend_block" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false  # IMPORTANT: allow public bucket policy
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 4️⃣ Bucket Policy to allow public read
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}


# 1️⃣ Get all files recursively from frontend/dist
locals {
  frontend_files = fileset("../frontend/dist", "**")
}

# 2️⃣ Upload each file to S3
resource "aws_s3_object" "frontend_objects" {
  for_each = { for f in local.frontend_files : f => f }

  bucket = aws_s3_bucket.frontend.id
  key    = each.key
  source = "../frontend/dist/${each.key}"
  etag   = filemd5("../frontend/dist/${each.key}")
    content_type = lookup({
    "html" = "text/html"
    "css"  = "text/css"
    "js"   = "application/javascript"
    "json" = "application/json"
    "png"  = "image/png"
    "jpg"  = "image/jpeg"
    "jpeg" = "image/jpeg"
    "svg"  = "image/svg+xml"
    "ico"  = "image/x-icon"
     "webp" = "image/webp"
  }, element(split(".", each.key), length(split(".", each.key)) - 1), "binary/octet-stream")

}






















 resource "aws_cloudfront_origin_access_control" "main" {
    name = "s3-cloudfront-oac-test"
    origin_access_control_origin_type = "s3"
    signing_behavior = "always"
    signing_protocol = "sigv4"
   
 }


resource "aws_cloudfront_distribution" "s3_distribution" {
  enabled             = true
  comment             = "React SPA CloudFront distribution"
  default_root_object = "index.html"
  is_ipv6_enabled = true
  wait_for_deployment = true

  origin {
  domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name 
  origin_access_control_id = aws_cloudfront_origin_access_control.main.id
  origin_id   =aws_s3_bucket.frontend.bucket
}



  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.frontend.bucket
    viewer_protocol_policy ="redirect-to-https"
    

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

   
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  price_class = "PriceClass_100"

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

    custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  

  tags = {
    Environment = "production"
  }
  # self id is used to set the actual cloudfront id
#   provisioner "local-exec" {
#   command = "aws cloudfront create-invalidation --distribution-id ${self.id} --paths '/*'"
# }
  
  # depends_on = [aws_cloudfront_distribution.s3_distribution]


}

# 1️⃣ Create S3 Bucket
resource "aws_s3_bucket" "frontend" {
  bucket = "aws-bucket-12555"  # Replace with your bucket name
  tags = {
    Name = "Frontend Bucket"
  }
}

# 2️⃣ Enable Public Website Hosting (index + error document)
resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# 3️⃣ Allow Terraform to put bucket policy (without ACLs)
resource "aws_s3_bucket_public_access_block" "frontend_block" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false  # IMPORTANT: allow public bucket policy
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 4️⃣ Bucket Policy to allow public read
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}


# 1️⃣ Get all files recursively from frontend/dist
locals {
  frontend_files = fileset("../frontend/dist", "**")
}

# 2️⃣ Upload each file to S3
resource "aws_s3_object" "frontend_objects" {
  for_each = { for f in local.frontend_files : f => f }

  bucket = aws_s3_bucket.frontend.id
  key    = each.key
  source = "../frontend/dist/${each.key}"
  etag   = filemd5("../frontend/dist/${each.key}")
    content_type = lookup({
    "html" = "text/html"
    "css"  = "text/css"
    "js"   = "application/javascript"
    "json" = "application/json"
    "png"  = "image/png"
    "jpg"  = "image/jpeg"
    "jpeg" = "image/jpeg"
    "svg"  = "image/svg+xml"
    "ico"  = "image/x-icon"
     "webp" = "image/webp"
  }, element(split(".", each.key), length(split(".", each.key)) - 1), "binary/octet-stream")

}






















 resource "aws_cloudfront_origin_access_control" "main" {
    name = "s3-cloudfront-oac-test"
    origin_access_control_origin_type = "s3"
    signing_behavior = "always"
    signing_protocol = "sigv4"
   
 }


resource "aws_cloudfront_distribution" "s3_distribution" {
  enabled             = true
  comment             = "React SPA CloudFront distribution"
  default_root_object = "index.html"
  is_ipv6_enabled = true
  wait_for_deployment = true

  origin {
  domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name 
  origin_access_control_id = aws_cloudfront_origin_access_control.main.id
  origin_id   =aws_s3_bucket.frontend.bucket
}



  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.frontend.bucket
    viewer_protocol_policy ="redirect-to-https"
    

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

   
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  price_class = "PriceClass_100"

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

    custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  

  tags = {
    Environment = "production"
  }
  # self id is used to set the actual cloudfront id
#   provisioner "local-exec" {
#   command = "aws cloudfront create-invalidation --distribution-id ${self.id} --paths '/*'"
# }
  
  # depends_on = [aws_cloudfront_distribution.s3_distribution]

}
 

 resource "null_resource" "invalidate_cache" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation \
      --distribution-id ${aws_cloudfront_distribution.s3_distribution.id} \
      --paths '/*'"
  }

  depends_on = [
    aws_cloudfront_distribution.s3_distribution,
    aws_s3_object.frontend_objects
  ]
}