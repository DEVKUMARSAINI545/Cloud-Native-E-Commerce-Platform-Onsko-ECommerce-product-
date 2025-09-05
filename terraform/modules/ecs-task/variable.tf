variable "family" {
  description = "Family name of task defination "
  type = string
}
variable "container_name" {
    description = "Repositry name"
    type = string
  
}
variable "logs_name" {
  description = "Cloudwatch logs group name"
  type = string
}
variable "container_port" {
  description = "container port"
  type = number
  
}
variable "image" {
  description = "repo image path"
  type = string
  
}