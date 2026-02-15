using System.Text.Json.Serialization;

namespace KuyumHesapWeb.Core.Feature.CureFeature.Dtos
{
    public class DailyCureDataDto
    {
        public class _100GrGramAltın
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class _10GrGramAltın
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class _20GrGramAltın
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class _50GrGramAltın
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class _5GrGramAltın
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class ALTIN
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class AUDTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class AUDUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class CADTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class CHFTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class Data
        {
            [JsonPropertyName("PARUSD")]
            public PARUSD PARUSD { get; set; }

            [JsonPropertyName("ALTIN")]
            public ALTIN ALTIN { get; set; }

            [JsonPropertyName("PAREUR")]
            public PAREUR PAREUR { get; set; }

            [JsonPropertyName("PARGBP")]
            public PARGBP PARGBP { get; set; }

            [JsonPropertyName("PARCHF")]
            public PARCHF PARCHF { get; set; }

            [JsonPropertyName("XAUUSD")]
            public XAUUSD XAUUSD { get; set; }

            [JsonPropertyName("XAUXAG")]
            public XAUXAG XAUXAG { get; set; }

            [JsonPropertyName("XAGUSD")]
            public XAGUSD XAGUSD { get; set; }

            [JsonPropertyName("GUMUSUSD")]
            public GUMUSUSD GUMUSUSD { get; set; }

            [JsonPropertyName("GUMUSTRY")]
            public GUMUSTRY GUMUSTRY { get; set; }

            [JsonPropertyName("AUDTRY")]
            public AUDTRY AUDTRY { get; set; }

            [JsonPropertyName("USDTRY")]
            public USDTRY USDTRY { get; set; }

            [JsonPropertyName("EURTRY")]
            public EURTRY EURTRY { get; set; }

            [JsonPropertyName("GBPTRY")]
            public GBPTRY GBPTRY { get; set; }

            [JsonPropertyName("CADTRY")]
            public CADTRY CADTRY { get; set; }

            [JsonPropertyName("CHFTRY")]
            public CHFTRY CHFTRY { get; set; }

            [JsonPropertyName("SARTRY")]
            public SARTRY SARTRY { get; set; }

            [JsonPropertyName("JPYTRY")]
            public JPYTRY JPYTRY { get; set; }

            [JsonPropertyName("NOKTRY")]
            public NOKTRY NOKTRY { get; set; }

            [JsonPropertyName("SEKTRY")]
            public SEKTRY SEKTRY { get; set; }

            [JsonPropertyName("DKKTRY")]
            public DKKTRY DKKTRY { get; set; }

            [JsonPropertyName("EURUSD")]
            public EURUSD EURUSD { get; set; }

            [JsonPropertyName("GBPUSD")]
            public GBPUSD GBPUSD { get; set; }

            [JsonPropertyName("USDCHF")]
            public USDCHF USDCHF { get; set; }

            [JsonPropertyName("USDCAD")]
            public USDCAD USDCAD { get; set; }

            [JsonPropertyName("AUDUSD")]
            public AUDUSD AUDUSD { get; set; }

            [JsonPropertyName("USDSAR")]
            public USDSAR USDSAR { get; set; }

            [JsonPropertyName("USDJPY")]
            public USDJPY USDJPY { get; set; }

            [JsonPropertyName("USDNOK")]
            public USDNOK USDNOK { get; set; }

            [JsonPropertyName("USDSEK")]
            public USDSEK USDSEK { get; set; }

            [JsonPropertyName("USDDKK")]
            public USDDKK USDDKK { get; set; }

            [JsonPropertyName("XAUEUR")]
            public XAUEUR XAUEUR { get; set; }

            [JsonPropertyName("XPTUSD")]
            public XPTUSD XPTUSD { get; set; }

            [JsonPropertyName("XPDUSD")]
            public XPDUSD XPDUSD { get; set; }

            [JsonPropertyName("PLATIN")]
            public PLATIN PLATIN { get; set; }

            [JsonPropertyName("PALADYUM")]
            public PALADYUM PALADYUM { get; set; }

            [JsonPropertyName("5 Gr Gram Altın")]
            public _5GrGramAltın _5GrGramAltn { get; set; }

            [JsonPropertyName("10 Gr Gram Altın")]
            public _10GrGramAltın _10GrGramAltn { get; set; }

            [JsonPropertyName("20 Gr Gram Altın")]
            public _20GrGramAltın _20GrGramAltn { get; set; }

            [JsonPropertyName("50 Gr Gram Altın")]
            public _50GrGramAltın _50GrGramAltn { get; set; }

            [JsonPropertyName("100 Gr Gram Altın")]
            public _100GrGramAltın _100GrGramAltn { get; set; }

            [JsonPropertyName("XAUUSDS")]
            public XAUUSDS XAUUSDS { get; set; }

            [JsonPropertyName("USDRUB")]
            public USDRUB USDRUB { get; set; }

            [JsonPropertyName("EURUSDS")]
            public EURUSDS EURUSDS { get; set; }

            [JsonPropertyName("KXAGUSD")]
            public KXAGUSD KXAGUSD { get; set; }

            [JsonPropertyName("XUSDTRY")]
            public XUSDTRY XUSDTRY { get; set; }

            [JsonPropertyName("FARKEUR")]
            public FARKEUR FARKEUR { get; set; }

            [JsonPropertyName("FARK")]
            public FARK FARK { get; set; }

            [JsonPropertyName("EURGBP")]
            public EURGBP EURGBP { get; set; }

            [JsonPropertyName("EURCHF")]
            public EURCHF EURCHF { get; set; }

            [JsonPropertyName("VADE FARK")]
            public VADEFARK VADEFARK { get; set; }
        }

        public class DKKTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class EURCHF
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class EURGBP
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class EURTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class EURUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class EURUSDS
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class FARK
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class FARKEUR
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public int alis { get; set; }

            [JsonPropertyName("satis")]
            public int satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class GBPTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class GBPUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class GUMUSTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class GUMUSUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class JPYTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class KXAGUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class Meta
        {
            [JsonPropertyName("time")]
            public long time { get; set; }

            [JsonPropertyName("time_formatted")]
            public string time_formatted { get; set; }

            [JsonPropertyName("fiyat_yayini")]
            public object fiyat_yayini { get; set; }

            [JsonPropertyName("fiyat_guncelleme")]
            public int fiyat_guncelleme { get; set; }
        }

        public class NOKTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class PALADYUM
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class PARCHF
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class PAREUR
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class PARGBP
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class PARUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class PLATIN
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class Root
        {
            [JsonPropertyName("meta")]
            public Meta meta { get; set; }

            [JsonPropertyName("data")]
            public Data data { get; set; }
        }

        public class SARTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class SEKTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDCAD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDCHF
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDDKK
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDJPY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDNOK
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDRUB
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public int alis { get; set; }

            [JsonPropertyName("satis")]
            public int satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDSAR
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDSEK
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class USDTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class VADEFARK
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public int alis { get; set; }

            [JsonPropertyName("satis")]
            public int satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class XAGUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class XAUEUR
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class XAUUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class XAUUSDS
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class XAUXAG
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class XPDUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class XPTUSD
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }

        public class XUSDTRY
        {
            [JsonPropertyName("code")]
            public string code { get; set; }

            [JsonPropertyName("alis")]
            public double alis { get; set; }

            [JsonPropertyName("satis")]
            public double satis { get; set; }

            [JsonPropertyName("tarih")]
            public string tarih { get; set; }
        }


    }
}
