namespace KuyumHesapWeb.Core.Feature.UserFeature.Dtos
{
    public class RoleResponseDto
    {
        public int Id { get; set; }
        /// <summary>
        /// Role Name
        /// </summary>
        public string Name { get; set; } = string.Empty;
        /// <summary>
        /// Role Kodu
        /// </summary>
        public string Code { get; set; } = string.Empty;
        /// <summary>
        /// Role Type
        /// </summary>
        public string Type { get; set; } = string.Empty;
    }
}
