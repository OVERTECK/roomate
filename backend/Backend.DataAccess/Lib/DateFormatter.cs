namespace Backend.DataAccess.Lib;

public class DateFormatter
{
    public static string GetDateTime()
    {
        var dateNow = DateTime.Now;
        
        return dateNow.ToString("yyyy-MM-dd HH:mm:ss");
    }
}