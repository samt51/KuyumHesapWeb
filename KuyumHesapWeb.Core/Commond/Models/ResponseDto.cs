namespace KuyumHesapWeb.Core.Commond.Models
{
    public class ResponseDto<T>
    {
        public T data { get; set; }
        public int statusCode { get; set; }
        public bool isSuccess { get; set; }
        public List<string> errors { get; set; } = new List<string>();
        public ResponseDto<T> Success()
        {
            return new ResponseDto<T> { data = data, statusCode = 200, isSuccess = true, errors = new List<string>() };
        }
        public ResponseDto<T> Success(T data)
        {
            return new ResponseDto<T> { data = data, statusCode = 200, isSuccess = true, errors = new List<string>() };
        }
        public ResponseDto<T> Fail(List<string> errors)
        {
            return new ResponseDto<T> { data = data, statusCode = 200, isSuccess = true, errors = errors };
        }
        public ResponseDto<T> Fail(string error)
        {
            errors.Add(error);
            return new ResponseDto<T> { errors = errors, statusCode = 400, isSuccess = false };
        }
    }
}
