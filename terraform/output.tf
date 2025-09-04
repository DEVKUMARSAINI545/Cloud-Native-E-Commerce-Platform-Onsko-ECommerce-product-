output "cloudfront_url" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}
output "s3_bucket_name" {
    value = aws_s3_bucket.frontend.bucket
  
}
output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.s3_distribution.id
}
output "aws_ecr_repository_url" {
  value = aws_ecr_repository.frontend.repository_url
  
}