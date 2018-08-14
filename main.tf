resource "aws_s3_bucket" "joincircles.net" {
  bucket = "joincircles.net"
  acl    = "private"

  tags {
    Name = "joincircles.net-bucket"
    Environment = "dev"
  }
}

locals {
  s3_origin_id = "S3-www.joincircles.net" // located in the console at: CloudFront Distributions > E12VI3U7WIL23J
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = "joincircles.net"
    origin_id   = "${local.s3_origin_id}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Managed by Terraform"
  default_root_object = "index.html"

  logging_config {
    include_cookies = false
    bucket          = "mylogs.s3.amazonaws.com" # todo: we need a bucket for logs??????
    prefix          = "joincircles.net"
  }

  aliases = ["joincircles.net", "www.joincircles.net"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"] # todo: pretty sure we dont need all these
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${local.s3_origin_id}"

    forwarded_values {
      query_string = false // todo: do we need query strings?

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/content/immutable/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "${local.s3_origin_id}"

    forwarded_values {
      query_string = false
      headers = ["Origin"]
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Cache behavior with precedence 1
  // todo: probably don't need this
  ordered_cache_behavior {
    path_pattern     = "/content/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${local.s3_origin_id}"

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
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  tags {
    Environment = "production"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}


resource "aws_route53_zone" "joincircles.net" {
  name = "joincircles.net"
}

resource "aws_route53_record" "joincircles.net" {
  zone_id = "${aws_route53_zone.joincircles.net.zone_id}"
  name    = "joincircles.net"
  type    = "A"
  ttl     = "300"
  records = ["dhlz1fm91p6pq.cloudfront.net"]
}
