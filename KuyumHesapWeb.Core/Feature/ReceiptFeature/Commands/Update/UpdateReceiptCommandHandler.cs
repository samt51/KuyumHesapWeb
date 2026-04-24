using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;
using System.Text.Json;

 

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Update
{
    public class UpdateReceiptCommandHandler : BaseHandler, IRequestHandler<UpdateReceiptCommandRequest, ResponseDto<UpdateReceiptCommandResponse>>
    {
        public UpdateReceiptCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateReceiptCommandResponse>> Handle(UpdateReceiptCommandRequest request, CancellationToken cancellationToken)
        {
            //if (request.CreateMovementReceiptRequestDtos != null)
            //{
            //    var counterList = new List<CreateMovementReceiptRequestDto>();
            //    foreach (var item in request.CreateMovementReceiptRequestDtos)
            //    {
            //        if (item.CounterTransactionId.HasValue)
            //        {
            //            int counterTransactionTypeId = 0;
            //            switch (item.TransactionTypeId)
            //            {
            //                case 1: counterTransactionTypeId = 2; break; // Nakit Giriş -> Çıkış
            //                case 2: counterTransactionTypeId = 1; break; // Nakit Çıkış -> Giriş
            //                case 3: counterTransactionTypeId = 4; break; // Ürün Giriş -> Çıkış
            //                case 4: counterTransactionTypeId = 3; break; // Ürün Çıkış -> Giriş
            //                case 5: counterTransactionTypeId = 6; break; // İskonto Alacak -> Borç
            //                case 6: counterTransactionTypeId = 5; break; // İskonto Borç -> Alacak
            //                case 7: counterTransactionTypeId = 8; break; // Virman Giriş -> Çıkış
            //                case 8: counterTransactionTypeId = 7; break; // Virman Çıkış -> Giriş
            //                case 9: counterTransactionTypeId = 10; break; // Çevirme Giriş -> Çıkış
            //                case 10: counterTransactionTypeId = 9; break; // Çevirme Çıkış -> Giriş
            //                default: counterTransactionTypeId = item.TransactionTypeId; break;
            //            }

            //            var counter = new CreateMovementReceiptRequestDto
            //            {
            //                MovementId = 0, // Yeni eklenecek/güncellenecek karşı kayıt
            //                TransactionTypeId = counterTransactionTypeId,
            //                AccountId = item.CounterTransactionId.Value,
            //                Description = "Karşı Hareket", // Sabit açıklama eklenebilir
            //                IsDeleted = item.IsDeleted,
            //                StockId = item.StockId,
            //                BaseCurrencyAmount = item.BaseCurrencyAmount,
            //                CostAmount = item.CostAmount,
            //                ProfitAmount = item.ProfitAmount,
            //                Quantity = item.Quantity,
            //                MillRate = item.MillRate,
            //                LaborCost = item.LaborCost,
            //                LaborUnit = item.LaborUnit,
            //                LaborQuantity = item.LaborQuantity,
            //                IsLaborIncluded = item.IsLaborIncluded,
            //                IsReconciled = item.IsReconciled,
            //                NetProductValue = item.NetProductValue,
            //                TotalLaborCost = item.TotalLaborCost
            //            };

            //            if (item.StockId != null)
            //            {
            //                // For products, don't flip Foreign and Counter amounts
            //                counter.ForeignCurrencyAmount = item.ForeignCurrencyAmount;
            //                counter.ForeignCurrencyId = item.ForeignCurrencyId;
            //                counter.ForeignExchangeRate = item.ForeignExchangeRate;
            //                counter.CounterCurrencyAmount = item.CounterCurrencyAmount;
            //                counter.CounterCurrencyId = item.CounterCurrencyId;
            //                counter.CounterExchangeRate = item.CounterExchangeRate;
            //            }
            //            else
            //            {
            //                // Flip Foreign and Counter for everything else
            //                counter.ForeignCurrencyAmount = item.CounterCurrencyAmount;
            //                counter.ForeignCurrencyId = item.CounterCurrencyId;
            //                counter.ForeignExchangeRate = item.CounterExchangeRate;
            //                counter.CounterCurrencyAmount = item.ForeignCurrencyAmount;
            //                counter.CounterCurrencyId = item.ForeignCurrencyId;
            //                counter.CounterExchangeRate = item.ForeignExchangeRate;
            //            }

            //            counterList.Add(counter);
            //        }
            //    }
            //    request.CreateMovementReceiptRequestDtos.AddRange(counterList);
            //}

            var data = await _apiService.PutAsync<UpdateReceiptCommandRequest, UpdateReceiptCommandResponse>("Receipt/Update", request);

            return data;
        }
    }
}
