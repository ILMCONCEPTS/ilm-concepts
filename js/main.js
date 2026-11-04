(function(){
  var cfg = window.ILM_CONFIG || {};
  var t=document.querySelector('.toggle'),m=document.querySelector('.menu');
  if(t){t.addEventListener('click',function(){var o=m.classList.toggle('open');t.setAttribute('aria-expanded',o)})}
  var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();

  // ----- Forms -----
  var SUBJECTS={maintenance:'New Maintenance Request – ILM Concepts',estimate:'New Estimate Request – ILM Concepts',junk:'New Junk Removal Request – ILM Concepts','junk-removal':'New Junk Removal Request – ILM Concepts',contract:'New Home Modification Request – ILM Concepts'};
  function labelFor(form,name){
    var el=form.querySelector('[name="'+name+'"]');if(!el)return name;
    var l=el.id&&form.querySelector('label[for="'+el.id+'"]');
    if(!l){var fs=el.closest('fieldset');l=fs&&fs.querySelector('legend')}
    if(el.type==='checkbox'&&!el.closest('.checkgroup')){l=el.closest('label')}
    var t=l?l.textContent.replace(/\*|\(optional\)/g,'').replace(/\s+/g,' ').trim():name;
    return t.length>90?t.slice(0,87)+'…':t;
  }
  // Text payload with readable labels; multi-checkbox groups joined into one line.
  function buildPayload(form,withFiles){
    var fd=new FormData(),seen={};
    form.querySelectorAll('input,select,textarea').forEach(function(el){
      var n=el.name;if(!n||n==='_honey'||seen[n])return;
      if(el.type==='file'){if(withFiles){for(var i=0;i<el.files.length;i++)fd.append(n,el.files[i])}return}
      seen[n]=1;var vals=[];
      form.querySelectorAll('[name="'+n+'"]').forEach(function(x){
        if((x.type==='checkbox'||x.type==='radio')){if(x.checked)vals.push(x.value)}else if(x.value.trim())vals.push(x.value.trim())});
      fd.append(labelFor(form,n),vals.join(', ')||'—');
    });
    return fd;
  }
  // Show success after a native (file upload) post redirects back here.
  if(/[?&]sent=1/.test(location.search)){
    var f0=document.querySelector('form[data-ilm]');
    if(f0){var s0=document.getElementById(f0.dataset.success);f0.hidden=true;s0.hidden=false}
  }
  document.querySelectorAll('form[data-ilm]').forEach(function(form){
    form.setAttribute('novalidate','');
    if(!cfg.FORM_ENDPOINT){var n=form.querySelector('.demo-note');if(n)n.hidden=false;}
    function check(el){
      var f=el.closest('.field, fieldset');if(!f)return true;
      var ok=el.checkValidity();
      var grp=el.closest('.checkgroup');
      if(grp){ok=grp.querySelectorAll('input:checked').length>=(+grp.dataset.min||1)}
      if(ok&&el.type==='file'&&el.files){var max=10*1024*1024;for(var i=0;i<el.files.length;i++){if(el.files[i].size>max)ok=false}}
      var fOk=ok;if(f.tagName==='FIELDSET'&&!grp){f.querySelectorAll('input').forEach(function(x){if(!x.checkValidity())fOk=false})}
      f.classList.toggle('invalid',!fOk);
      el.setAttribute('aria-invalid',!ok);return ok;
    }
    form.querySelectorAll('input,select,textarea').forEach(function(el){
      el.addEventListener('blur',function(){if(el.type!=='radio'&&el.type!=='checkbox')check(el)});
      el.addEventListener('change',function(){check(el)});
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var hp=form.querySelector('[name=_honey]');
      var bad=null;
      form.querySelectorAll('input,select,textarea').forEach(function(el){if(el.name!=='_honey'&&!check(el)&&!bad)bad=el});
      if(bad){bad.focus();return}
      var btn=form.querySelector('[type=submit]'),er=form.querySelector('.send-err');
      if(er)er.hidden=true;
      btn.disabled=true;btn.textContent='Sending…';
      var done=function(demo){
        var s=document.getElementById(form.dataset.success);
        form.hidden=true;s.hidden=false;
        if(demo){s.querySelector('.demo-flag').hidden=false}
        s.setAttribute('tabindex','-1');s.focus();window.scrollTo({top:s.offsetTop-120,behavior:'smooth'});
      };
      var fail=function(){btn.disabled=false;btn.textContent='Try again';if(er){er.hidden=false;er.scrollIntoView({block:'center'})}};
      if(!cfg.FORM_ENDPOINT){
        // DEMO MODE: no endpoint configured -> nothing is sent. Shows success UI only.
        setTimeout(function(){done(true)},500);return;
      }
      if(hp&&hp.value){done(false);return} // bot filled honeypot: silently drop
      var subject=SUBJECTS[form.dataset.ilm]||'New Website Request – ILM Concepts';
      var email=form.querySelector('[name=email]');
      var hasFiles=[].some.call(form.querySelectorAll('input[type=file]'),function(x){return x.files&&x.files.length});
      var meta={_subject:subject,_template:'table',_captcha:'false',_replyto:email?email.value:''};
      if(hasFiles){
        // FormSubmit only accepts attachments on a normal (non-AJAX) multipart post.
        var nf=document.createElement('form');nf.method='POST';nf.enctype='multipart/form-data';nf.hidden=true;
        nf.action=cfg.FORM_ENDPOINT.replace('/ajax/','/');
        meta._next=location.href.split('?')[0]+'?sent=1';
        var fd=buildPayload(form,false);fd.forEach(function(v,k){meta[k]=v});
        Object.keys(meta).forEach(function(k){var i=document.createElement('input');i.type='hidden';i.name=k;i.value=meta[k];nf.appendChild(i)});
        form.querySelectorAll('input[type=file]').forEach(function(fi){if(fi.files.length){var c=fi.cloneNode();c.files=fi.files;c.name=labelFor(form,fi.name);nf.appendChild(c)}});
        document.body.appendChild(nf);nf.submit();return;
      }
      var body=buildPayload(form,false);Object.keys(meta).forEach(function(k){body.append(k,meta[k])});
      fetch(cfg.FORM_ENDPOINT,{method:'POST',body:body,headers:{Accept:'application/json'}})
        .then(function(r){return r.json().catch(function(){return {}}).then(function(j){
          if(!r.ok||String(j.success)!=='true')throw new Error(j.message||'send failed');done(false)})})
        .catch(fail);
    });
  });

  // ----- Payments -----
  var pf=document.getElementById('payForm');
  if(pf){
    var slot=document.getElementById('paySlot');
    if(cfg.PAYMENT_LINK){slot.innerHTML='<p><strong>Secure hosted checkout</strong></p><p class="hint">You will be redirected to our payment provider to enter payment details.</p>'}
    pf.addEventListener('ilm-valid',function(){});
    pf.addEventListener('submit',function(e){
      e.preventDefault();var ok=true,first=null;
      pf.querySelectorAll('input,select').forEach(function(el){var f=el.closest('.field,fieldset');var v=el.checkValidity();if(f)f.classList.toggle('invalid',!v);if(!v&&!first)first=el;ok=ok&&v});
      if(!ok){first.focus();return}
      if(cfg.PAYMENT_LINK){
        var u=new URL(cfg.PAYMENT_LINK);
        // Stripe Payment Links accept prefilled_email & client_reference_id; adjust for Square etc.
        u.searchParams.set('prefilled_email',pf.email.value);
        u.searchParams.set('client_reference_id',pf.invoice.value.replace(/[^A-Za-z0-9_-]/g,''));
        window.location.href=u.toString();
      } else {
        var s=document.getElementById('paySuccess');pf.hidden=true;s.hidden=false;s.focus();
      }
    });
  }
})();
