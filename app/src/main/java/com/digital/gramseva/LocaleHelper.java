package com.digital.gramseva;

import android.content.Context;
import android.content.res.Configuration;

import java.util.Locale;

public class LocaleHelper {

    public static Context setLocale(Context context, String lang) {
        Locale locale = getLocale(lang);
        Locale.setDefault(locale);
        Configuration config = new Configuration(context.getResources().getConfiguration());
        config.setLocale(locale);
        return context.createConfigurationContext(config);
    }

    private static Locale getLocale(String lang) {
        if (lang.equals("hindi")) {
            return new Locale("hi");
        }
        return new Locale("en");
    }
}
