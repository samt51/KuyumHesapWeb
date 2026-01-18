using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Concrete;
using KuyumHesapWeb.Core.Commond.Concrete.ApiClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using System.Net.Http.Headers;
using KuyumHesapWeb.Core.Commond.Concrete.Mapping;


namespace KuyumHesapWeb.Core
{
    public static class Registration
    {
        public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
        {
            var assembly = Assembly.GetExecutingAssembly();
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));


            services.AddTransient<JwtHandler>();
            services.AddAutoMapper(typeof(MappingProfile).Assembly);
            services.AddScoped<KuyumHesapWeb.Core.Commond.Abstract.Mapper.IMapper, Mapper>();





            services.AddHttpClient<IApiService, ApiService>(client =>
            {
                var apiAddress = configuration["ApiAdress"];

                if (string.IsNullOrEmpty(apiAddress))
                    throw new Exception("ApiAdress configuration is missing");


                client.BaseAddress = new Uri(apiAddress);
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));
            })
            .AddHttpMessageHandler<JwtHandler>();

            return services;

        }
    }
}
